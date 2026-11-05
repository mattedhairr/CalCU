#!/usr/bin/env bash
# ============================================================================
# CalCU by YouDO - Linux installer. Run it with: bash install-calcu.sh
#
# Installs for this user only, in ~/.local and ~/.config. It only uses sudo if
# GTK or WebKitGTK are missing, and it asks first.
# ============================================================================
set -u

# The CalCU website rewrites this line for custom downloads.
HOTKEY="Alt+C"

SYSTEM_PYTHON=/usr/bin/python3
BIN="$HOME/.local/bin/calcu"
MENU_ENTRY="$HOME/.local/share/applications/calcu.desktop"
AUTOSTART_ENTRY="$HOME/.config/autostart/calcu.desktop"
GNOME_SCHEMA=org.gnome.settings-daemon.plugins.media-keys
GNOME_PATH=/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/calcu/

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_FILE="$SCRIPT_DIR/$(basename "${BASH_SOURCE[0]}")"

fail() {
    echo "[ERROR] $1" >&2
    exit 1
}

has_dependencies() {
    "$SYSTEM_PYTHON" - >/dev/null 2>&1 <<'PY'
import gi
gi.require_version("Gtk", "3.0")
try:
    gi.require_version("WebKit2", "4.1")
except ValueError:
    gi.require_version("WebKit2", "4.0")
from gi.repository import Gtk, WebKit2
PY
}

# Prints the command that installs what CalCU needs on this distribution.
install_command() {
    if command -v apt-get >/dev/null 2>&1; then
        local webkit=gir1.2-webkit2-4.1
        apt-cache show "$webkit" >/dev/null 2>&1 || webkit=gir1.2-webkit2-4.0
        echo "sudo apt-get install -y python3 python3-gi gir1.2-gtk-3.0 $webkit"
    elif command -v dnf >/dev/null 2>&1; then
        echo "sudo dnf install -y python3 python3-gobject gtk3 webkit2gtk4.1"
    elif command -v pacman >/dev/null 2>&1; then
        echo "sudo pacman -S --needed python python-gobject gtk3 webkit2gtk-4.1"
    elif command -v zypper >/dev/null 2>&1; then
        echo "sudo zypper install python3 python3-gobject-Gdk typelib-1_0-Gtk-3_0 typelib-1_0-WebKit2-4_1"
    fi
}

ensure_dependencies() {
    if [ -x "$SYSTEM_PYTHON" ] && has_dependencies; then
        return
    fi
    local command
    command="$(install_command)"
    echo "  CalCU needs Python with GTK 3 and WebKitGTK, which are missing."
    if [ -z "$command" ]; then
        fail "Install them with your package manager (Python GObject, GTK 3, WebKit2GTK), then run this again."
    fi
    echo "  This installs them, and needs your password:"
    echo
    echo "    $command"
    echo
    local answer=""
    if [ -r /dev/tty ]; then
        read -r -p "  Run it now? [y/N] " answer </dev/tty || answer=""
    fi
    case "$answer" in
        y | Y | yes | YES) $command || fail "The packages could not be installed." ;;
        *) fail "Run that command yourself, then run this installer again." ;;
    esac
    { [ -x "$SYSTEM_PYTHON" ] && has_dependencies; } ||
        fail "GTK 3 and WebKitGTK still can't be loaded from $SYSTEM_PYTHON."
}

# Where the program comes from:
#  - single-file download from the website: appended after the marker line at
#    the end of this file
#  - GitHub repo or release zip: calcu.py next to this file
write_program() {
    local target="$1"
    sed '1,/^# CALCU-PYTHON-BELOW$/d' "$SCRIPT_FILE" >"$target"
    if ! grep -q '^APP_ID = ' "$target"; then
        [ -f "$SCRIPT_DIR/calcu.py" ] || fail "calcu.py was not found next to install-calcu.sh."
        cp "$SCRIPT_DIR/calcu.py" "$target" || fail "Could not write $target."
    fi
    chmod 755 "$target"
}

write_desktop_entry() {
    local path="$1" arguments="$2"
    mkdir -p "$(dirname "$path")"
    cat >"$path" <<EOF
[Desktop Entry]
Type=Application
Name=CalCU
Comment=GATE virtual calculator overlay by YouDO
Exec="$BIN"$arguments
Icon=accessories-calculator
Terminal=false
Categories=Education;Utility;
EOF
}

# "Ctrl+Shift+C" -> "<Ctrl><Shift>c", the form GNOME stores.
gnome_binding() {
    local binding="" part parts
    IFS='+' read -ra parts <<<"$1"
    for part in "${parts[@]}"; do
        case "$part" in
            Alt | Ctrl | Shift) binding+="<$part>" ;;
            Win) binding+="<Super>" ;;
            Space) binding+="space" ;;
            [A-Z]) binding+="$(printf '%s' "$part" | tr '[:upper:]' '[:lower:]')" ;;
            *) binding+="$part" ;;
        esac
    done
    printf '%s' "$binding"
}

is_gnome() {
    case ":${XDG_CURRENT_DESKTOP:-}:" in
        *:GNOME:* | *:ubuntu:* | *:Unity:* | *:Pop:*) command -v gsettings >/dev/null 2>&1 ;;
        *) return 1 ;;
    esac
}

# Adds CalCU to GNOME's custom shortcuts, keeping any that are already there.
set_gnome_shortcut() {
    local list new_list
    list="$(gsettings get "$GNOME_SCHEMA" custom-keybindings)" || return 1
    case "$list" in
        *"'$GNOME_PATH'"*) new_list="$list" ;;
        "[]" | "@as []") new_list="['$GNOME_PATH']" ;;
        *) new_list="${list%]}, '$GNOME_PATH']" ;;
    esac
    local item="$GNOME_SCHEMA.custom-keybinding:$GNOME_PATH"
    local quote="\\'"
    gsettings set "$item" name "CalCU" &&
        gsettings set "$item" command "'\"${BIN//\'/$quote}\" --toggle'" &&
        gsettings set "$item" binding "$(gnome_binding "$HOTKEY")" &&
        gsettings set "$GNOME_SCHEMA" custom-keybindings "$new_list"
}

main() {
    echo "============================================================================"
    echo "  CalCU by YouDO"
    echo "  GATE virtual calculator overlay. Shortcut: $HOTKEY"
    echo "============================================================================"
    echo

    echo "[1/5] Checking for GTK 3 and WebKitGTK..."
    ensure_dependencies

    echo "[2/5] Installing CalCU to ~/.local/bin..."
    [ -x "$BIN" ] && "$BIN" --quit >/dev/null 2>&1
    mkdir -p "$(dirname "$BIN")" || fail "Could not create $(dirname "$BIN")."
    write_program "$BIN"

    echo "[3/5] Setting CalCU to start when you log in..."
    write_desktop_entry "$MENU_ENTRY" " --toggle"
    write_desktop_entry "$AUTOSTART_ENTRY" ""

    echo "[4/5] Setting the $HOTKEY shortcut..."
    local shortcut_set=no
    if is_gnome && set_gnome_shortcut; then
        shortcut_set=yes
    fi

    echo "[5/5] Starting CalCU..."
    nohup "$BIN" --show >/dev/null 2>&1 &
    disown

    echo
    echo "  CalCU is installed."
    echo
    echo "  HOW TO USE"
    if [ "$shortcut_set" = yes ]; then
        echo "  - Press $HOTKEY anywhere to show / hide the calculator."
    else
        echo "  - ONE STEP LEFT: CalCU could not set the shortcut on this desktop."
        echo "    Open your keyboard settings, add a custom shortcut for $HOTKEY,"
        echo "    and give it this command:"
        echo
        echo "      \"$BIN\" --toggle"
        echo
    fi
    echo "  - CalCU starts when you log in, hidden until you ask for it."
    echo "  - You can also open it from your app menu."
    echo "  - Run: \"$BIN\" --quit to close it."
    echo "  - Run uninstall-calcu.sh to remove it."
    echo
}

main
exit 0
# CALCU-PYTHON-BELOW
