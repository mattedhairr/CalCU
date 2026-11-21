#!/usr/bin/python3
# ============================================================================
# CalCU by YouDO
# Show / hide the GATE virtual scientific calculator anywhere on Linux.
#
# Repository: https://github.com/mattedhairr/CalCU
# YouDO:      https://github.com/mattedhairr/YouDO (https://youdo-app.vercel.app)
# License:    MIT
#
# Uses the system Python with GTK 3 and WebKitGTK, so there is nothing to build.
#
#   calcu            start hidden and wait (this is what runs at login)
#   calcu --toggle   show or hide the calculator (the keyboard shortcut runs this)
#   calcu --show     show the calculator
#   calcu --reload   load the calculator page again
#   calcu --quit     close CalCU
# ============================================================================

import json
import os
import re
import signal
import sys
import threading
import urllib.request

# Keep in step with the Version line in windows-overlay/CalCU.cs.
VERSION = "1.3.0"

# ---- Settings ---------------------------------------------------------------
# The shortcut itself belongs to the desktop (see install-calcu.sh): Wayland does
# not let an app claim a global key. This label is only shown in the tray menu.
HOTKEY_LABEL = "Alt+C"
WINDOW_OPACITY = 0.98
ALWAYS_ON_TOP = True
HIDE_ON_ESCAPE = True
START_POSITION = "TopRight"  # TopRight | BottomRight | Center
CALCULATOR_URL = "https://tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html"
# Once a day CalCU reads the version number from VERSION_URL, and sends nothing
# about you. A newer version is shown once in a notification whose Download
# button opens DOWNLOAD_URL. Nothing downloads or installs by itself.
CHECK_FOR_UPDATES = True
VERSION_URL = "https://calcu-youdo.vercel.app/version.json"
DOWNLOAD_URL = "https://calcu-youdo.vercel.app"
# -----------------------------------------------------------------------------

FIRST_CHECK_SECONDS = 30
CHECK_EVERY_SECONDS = 24 * 60 * 60

# The window is exactly the size of the calculator on the page, so it looks like
# the exam calculator and nothing else (no extra title bar).
CALC_WIDTH = 463
CALC_HEIGHT = 330
SCREEN_MARGIN = 24

APP_ID = "com.mattedhairr.CalCU"
COMMANDS = ("--toggle", "--show", "--reload", "--quit")

# Runs in the calculator page once it has loaded. It removes the page margin and
# hands the calculator's own controls to this window: dragging the blue bar moves
# the window, _ and X hide it, and so does Esc. The page's own _ would fold the
# keys away, and its X does nothing. The memory "M" shown after MS or M+ would
# take a line of its own and push the keys out of the window, so it is pinned
# inside the result box.
PAGE_SCRIPT = r"""
(function () {
    var $ = window.jQuery;
    if (!$ || window.calcuReady) return;
    window.calcuReady = true;
    var send = function (message) {
        window.webkit.messageHandlers.calcu.postMessage(message);
    };
    $('body').css({ margin: 0, overflow: 'hidden' });
    $('#helptopDiv, #keyPad font').css('font-size', '16px');
    $('#memory').css({ position: 'absolute', left: '20px', top: '97px', right: 'auto', bottom: 'auto', zIndex: 1 });
    $('.calc_min').die('click');
    $('.calc_max').die('click');
    $('#calc_min, #closeButton').unbind('click').click(function () {
        send('hide');
        return false;
    });
    $('#helptopDiv').css('cursor', 'move').mousedown(function (e) {
        if (e.which !== 1 || $(e.target).closest('.help_back').length) return;
        send('drag');
        return false;
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 27) send('escape');
    });
})();
"""

USAGE = """CalCU by YouDO v%s

  calcu            start hidden and wait
  calcu --toggle   show or hide the calculator
  calcu --show     show the calculator
  calcu --reload   load the calculator page again
  calcu --quit     close CalCU
""" % VERSION


def read_version(text):
    """version.json looks like {"version": "1.3.0"}. Anything else gives None."""
    try:
        version = json.loads(text).get("version")
    except (ValueError, AttributeError):
        return None
    if isinstance(version, str) and re.fullmatch(r"\d+(\.\d+){1,3}", version):
        return version
    return None


def is_newer(latest, current):
    def parts(version):
        numbers = [int(part) for part in version.split(".")]
        return numbers + [0] * (4 - len(numbers))

    try:
        return parts(latest) > parts(current)
    except ValueError:
        return False


def read_command(args):
    """Handles what needs no window, and returns the command to run (or None)."""
    if len(args) > 1:
        sys.stderr.write(USAGE)
        sys.exit(2)
    if not args:
        return None
    if args[0] in ("--help", "-h"):
        sys.stdout.write(USAGE)
        sys.exit(0)
    if args[0] == "--version":
        print(VERSION)
        sys.exit(0)
    if args[0] not in COMMANDS:
        sys.stderr.write(USAGE)
        sys.exit(2)
    return args[0]


read_command(sys.argv[1:])

# Wayland does not let an app keep itself on top or place its window, so CalCU
# runs through XWayland wherever that is available. Both of these must be set
# before GTK and WebKit load. The second avoids a blank window on some graphics
# drivers; this page does not need the faster renderer it turns off.
if os.environ.get("DISPLAY"):
    os.environ["GDK_BACKEND"] = "x11"
os.environ.setdefault("WEBKIT_DISABLE_DMABUF_RENDERER", "1")

try:
    import gi

    gi.require_version("Gdk", "3.0")
    gi.require_version("Gtk", "3.0")
    try:
        gi.require_version("WebKit2", "4.1")
    except ValueError:
        gi.require_version("WebKit2", "4.0")
    from gi.repository import Gdk, Gio, GLib, Gtk, WebKit2
except (ImportError, ValueError) as error:
    sys.stderr.write(
        "CalCU needs GTK 3 and WebKitGTK for Python (%s).\n"
        "Run install-calcu.sh again; it shows what to install.\n" % error
    )
    sys.exit(1)


def load_tray_library():
    """The tray icon is optional: GNOME, for one, hides tray icons by default."""
    for name in ("AyatanaAppIndicator3", "AppIndicator3"):
        try:
            gi.require_version(name, "0.1")
            return __import__("gi.repository." + name, fromlist=[name])
        except (ImportError, ValueError):
            pass
    return None


# Remembers which version the notification was shown for, so it shows once per
# version. The uninstaller removes this folder.
def notified_version_path():
    return os.path.join(GLib.get_user_config_dir(), "calcu", "notified-version")


def read_notified_version():
    try:
        with open(notified_version_path(), encoding="utf-8") as state:
            return state.read().strip()
    except OSError:
        return None


def save_notified_version(version):
    path = notified_version_path()
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as state:
            state.write(version + "\n")
    except OSError:
        pass


def x11_server_time(gdk_window):
    """A real timestamp lets the window take focus when the shortcut opens it."""
    try:
        gi.require_version("GdkX11", "3.0")
        from gi.repository import GdkX11

        return GdkX11.x11_get_server_time(gdk_window)
    except (ImportError, ValueError, TypeError):
        return None


class CalcuApp(Gtk.Application):
    def __init__(self):
        # Gtk.Application keeps this to one running copy: a second "calcu --toggle"
        # hands its command to the first and exits.
        super().__init__(
            application_id=APP_ID,
            flags=Gio.ApplicationFlags.HANDLES_COMMAND_LINE,
        )
        self.window = None
        self.view = None
        self.indicator = None
        self.tray_menu = None
        self.update_item = None
        self.position = None
        self.load_failed = False
        self.press_time = Gdk.CURRENT_TIME

    def do_startup(self):
        Gtk.Application.do_startup(self)
        self.hold()  # stay running while the window is hidden
        self.build_window()
        self.build_tray()
        self.load_calculator()
        download = Gio.SimpleAction.new("download", None)
        download.connect("activate", lambda *_: self.open_download_page())
        self.add_action(download)
        if CHECK_FOR_UPDATES:
            GLib.timeout_add_seconds(FIRST_CHECK_SECONDS, self.on_first_update_check)

    def do_command_line(self, command_line):
        command = read_command(command_line.get_arguments()[1:])
        if command == "--toggle":
            self.toggle()
        elif command == "--show":
            self.show_overlay()
        elif command == "--reload":
            self.load_calculator()
        elif command == "--quit":
            self.quit()
        return 0

    def build_window(self):
        self.window = Gtk.ApplicationWindow(application=self)
        self.window.set_title("CalCU - GATE Calculator")
        self.window.set_decorated(False)
        self.window.set_resizable(False)
        self.window.set_skip_taskbar_hint(True)
        self.window.set_skip_pager_hint(True)
        self.window.set_keep_above(ALWAYS_ON_TOP)
        self.window.set_opacity(WINDOW_OPACITY)
        self.window.connect("delete-event", self.on_delete)

        # Ephemeral, so CalCU leaves no browser data behind on the disk.
        content_manager = WebKit2.UserContentManager()
        content_manager.register_script_message_handler("calcu")
        content_manager.connect("script-message-received::calcu", self.on_page_message)
        self.view = WebKit2.WebView(
            web_context=WebKit2.WebContext.new_ephemeral(),
            user_content_manager=content_manager,
        )
        self.view.set_size_request(CALC_WIDTH, CALC_HEIGHT)
        self.view.connect("load-changed", self.on_load_changed)
        self.view.connect("load-failed", self.on_load_failed)
        self.view.connect("context-menu", lambda *_: True)
        self.view.connect("button-press-event", self.on_button_press)
        self.view.show()
        self.window.add(self.view)
        self.position = self.start_position()

    def start_position(self):
        display = Gdk.Display.get_default()
        monitor = display.get_primary_monitor() or display.get_monitor(0)
        if monitor is None:
            return None
        area = monitor.get_workarea()
        if START_POSITION == "Center":
            return (
                area.x + (area.width - CALC_WIDTH) // 2,
                area.y + (area.height - CALC_HEIGHT) // 2,
            )
        left = area.x + area.width - CALC_WIDTH - SCREEN_MARGIN
        if START_POSITION == "BottomRight":
            return left, area.y + area.height - CALC_HEIGHT - SCREEN_MARGIN
        return left, area.y + SCREEN_MARGIN

    def build_tray(self):
        library = load_tray_library()
        if library is None:
            return
        menu = Gtk.Menu()
        title = Gtk.MenuItem(label="CalCU by YouDO v" + VERSION)
        title.set_sensitive(False)
        menu.append(title)
        menu.append(Gtk.SeparatorMenuItem())
        for label, action in (
            ("Toggle CalCU (" + HOTKEY_LABEL + ")", self.toggle),
            ("Reload Calculator", self.load_calculator),
            ("Exit CalCU", self.quit),
        ):
            item = Gtk.MenuItem(label=label)
            item.connect("activate", lambda _item, run=action: run())
            menu.append(item)
        menu.show_all()
        self.tray_menu = menu
        self.indicator = library.Indicator.new(
            "calcu",
            "accessories-calculator",
            library.IndicatorCategory.APPLICATION_STATUS,
        )
        self.indicator.set_status(library.IndicatorStatus.ACTIVE)
        self.indicator.set_menu(menu)

    def on_first_update_check(self):
        self.check_for_update()
        GLib.timeout_add_seconds(CHECK_EVERY_SECONDS, self.on_daily_update_check)
        return False  # run once; the daily check takes over

    def on_daily_update_check(self):
        self.check_for_update()
        return True

    def check_for_update(self):
        # The download runs beside GTK, which is only touched again from idle_add.
        threading.Thread(target=self.fetch_latest_version, daemon=True).start()

    def fetch_latest_version(self):
        request = urllib.request.Request(
            VERSION_URL, headers={"User-Agent": "CalCU/" + VERSION}
        )
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                latest = read_version(response.read().decode("utf-8"))
        except Exception:
            return
        if latest and is_newer(latest, VERSION):
            GLib.idle_add(self.show_update, latest)

    def show_update(self, latest):
        if self.tray_menu is not None:
            if self.update_item is None:
                self.update_item = Gtk.MenuItem()
                self.update_item.connect("activate", lambda _item: self.open_download_page())
                self.tray_menu.insert(self.update_item, 1)
                self.update_item.show()
            self.update_item.set_label("Update to %s…" % latest)

        if read_notified_version() != latest:
            notification = Gio.Notification.new("CalCU %s is available" % latest)
            notification.set_body(
                "You have %s. Download it from the CalCU website, "
                "then run the new installer." % VERSION
            )
            notification.set_icon(Gio.ThemedIcon.new("accessories-calculator"))
            notification.add_button("Download", "app.download")
            notification.set_default_action("app.download")
            self.send_notification("calcu-update", notification)
            save_notified_version(latest)
        return False

    def open_download_page(self):
        try:
            Gio.AppInfo.launch_default_for_uri(DOWNLOAD_URL, None)
        except GLib.Error:
            pass

    def load_calculator(self):
        self.load_failed = False
        self.view.load_uri(CALCULATOR_URL)

    def on_load_changed(self, view, event):
        if event == WebKit2.LoadEvent.FINISHED and not self.load_failed:
            view.run_javascript(PAGE_SCRIPT, None, None, None)

    def on_load_failed(self, _view, _event, _uri, _error):
        # CalCU may start at login before the network is up: try again on next show.
        self.load_failed = True
        return False

    def on_page_message(self, _manager, result):
        message = result.get_js_value().to_string()
        if message == "drag":
            self.start_drag()
        elif message == "hide" or (message == "escape" and HIDE_ON_ESCAPE):
            self.hide_overlay()

    def on_button_press(self, _view, event):
        self.press_time = event.time
        return False

    def start_drag(self):
        gdk_window = self.window.get_window()
        if gdk_window is None:
            return
        pointer = Gdk.Display.get_default().get_default_seat().get_pointer()
        _, x, y, state = gdk_window.get_device_position(pointer)
        # The page's message arrives slightly late. If the button is already up
        # (a quick click), starting a move now would leave the window stuck to it.
        if not state & Gdk.ModifierType.BUTTON1_MASK:
            return
        origin_x, origin_y = gdk_window.get_origin()[1:]
        self.window.begin_move_drag(
            Gdk.BUTTON_PRIMARY, origin_x + x, origin_y + y, self.press_time
        )

    def on_delete(self, *_):
        self.hide_overlay()
        return True

    def toggle(self):
        if self.window.get_visible():
            self.hide_overlay()
        else:
            self.show_overlay()

    def hide_overlay(self):
        # Window managers forget a hidden window's place, so remember it here.
        self.position = self.window.get_position()
        self.window.hide()

    def show_overlay(self):
        if self.load_failed:
            self.load_calculator()
        if self.position is not None:
            self.window.move(*self.position)
        self.window.show()
        self.window.set_keep_above(ALWAYS_ON_TOP)
        server_time = x11_server_time(self.window.get_window())
        if server_time is None:
            self.window.present()
        else:
            self.window.present_with_time(server_time)


def main():
    signal.signal(signal.SIGINT, signal.SIG_DFL)
    GLib.set_prgname("calcu")
    GLib.set_application_name("CalCU")
    return CalcuApp().run(sys.argv)


if __name__ == "__main__":
    sys.exit(main())
