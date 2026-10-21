// ============================================================================
// CalCU by YouDO
// Show / hide the GATE virtual scientific calculator anywhere on Windows.
//
// Repository: https://github.com/mattedhairr/CalCU
// YouDO:      https://github.com/mattedhairr/YouDO (https://youdo-app.vercel.app)
// License:    MIT
//
// Written for the C# 5 compiler that ships with .NET Framework 4 (csc.exe),
// so keep to C# 5 syntax: no string interpolation, no ?. operator.
// ============================================================================

using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Microsoft.Win32;

namespace CalCU
{
    public class OverlayForm : Form
    {
        // ---- Settings -------------------------------------------------------
        // The CalCU website rewrites these lines for custom downloads, so keep
        // each one on a single line in the form: private <type> NAME = value;
        private const uint HOTKEY_MODIFIER = 0x0001; // MOD_ALT
        private const uint HOTKEY_KEY = 0x43; // VK_C
        private const string HOTKEY_LABEL = "Alt+C";
        private const double WINDOW_OPACITY = 0.98;
        private static readonly bool ALWAYS_ON_TOP = true;
        private static readonly bool HIDE_ON_ESCAPE = true;
        private static readonly string START_POSITION = "TopRight"; // TopRight | BottomRight | Center
        private const string CALCULATOR_URL = "https://tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html";
        // ---------------------------------------------------------------------

        // The window is exactly the size of the calculator on the page, so it
        // looks like the exam calculator and nothing else (no extra title bar).
        private const int CALC_WIDTH = 463;
        private const int CALC_HEIGHT = 330;

        // Runs in the calculator page once it has loaded. It removes the page
        // margin and hands the calculator's own controls to this window:
        // dragging the blue bar moves the window, _ and X hide it, and so does
        // Esc. The page's own _ would fold the keys away, and its X does nothing.
        // The title and the cube-root key use the browser's default text size,
        // which the engine already enlarges for display scaling; pinning them
        // to 16px stops them being scaled twice (once more by the page zoom).
        private const string PAGE_SCRIPT = @"
(function () {
    var $ = window.jQuery;
    if (!$ || window.calcuReady) return;
    window.calcuReady = true;
    $('#helptopDiv, #keyPad font').css('font-size', '16px');
    $('.calc_min').die('click');
    $('.calc_max').die('click');
    $('#calc_min, #closeButton').unbind('click').click(function () {
        window.external.HideCalculator();
        return false;
    });
    $('#helptopDiv').css('cursor', 'move').mousedown(function (e) {
        if (e.which !== 1 || $(e.target).closest('.help_back').length) return;
        window.external.StartDrag();
        return false;
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 27) window.external.EscapePressed();
    });
})();";

        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [DllImport("user32.dll")]
        private static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);

        [DllImport("user32.dll")]
        private static extern bool UnregisterHotKey(IntPtr hWnd, int id);

        [DllImport("user32.dll")]
        private static extern bool ReleaseCapture();

        [DllImport("user32.dll")]
        private static extern IntPtr SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);

        private const int HOTKEY_ID = 9001;
        private const int WM_HOTKEY = 0x0312;
        private const int WM_NCLBUTTONDOWN = 0xA1;
        private const int HT_CAPTION = 0x2;

        private WebBrowser browser;
        private NotifyIcon trayIcon;

        // Display scaling (1.0 at 100%, 2.0 at 200%). CalCU draws at the real
        // resolution and zooms the page by this much, instead of letting
        // Windows stretch a 100% picture, which looks blurry.
        private readonly float dpiScale;

        public OverlayForm()
        {
            SetBrowserFeatureControl();

            using (Graphics screen = Graphics.FromHwnd(IntPtr.Zero))
            {
                dpiScale = screen.DpiX / 96f;
            }

            this.Text = "CalCU - GATE Calculator (" + HOTKEY_LABEL + ")";
            this.FormBorderStyle = FormBorderStyle.None;
            this.ClientSize = new Size(Scaled(CALC_WIDTH), Scaled(CALC_HEIGHT));
            this.TopMost = ALWAYS_ON_TOP;
            this.Opacity = WINDOW_OPACITY;
            this.ShowInTaskbar = false;
            this.BackColor = Color.FromArgb(218, 218, 218); // the calculator's grey, shown while loading

            Rectangle workArea = Screen.PrimaryScreen.WorkingArea;
            if (START_POSITION == "Center")
            {
                this.StartPosition = FormStartPosition.CenterScreen;
            }
            else
            {
                this.StartPosition = FormStartPosition.Manual;
                int top = START_POSITION == "BottomRight"
                    ? workArea.Bottom - this.Height - Scaled(24)
                    : workArea.Top + Scaled(24);
                this.Location = new Point(workArea.Right - this.Width - Scaled(24), top);
            }

            browser = new WebBrowser
            {
                Dock = DockStyle.Fill,
                ScrollBarsEnabled = false,
                ScriptErrorsSuppressed = true,
                IsWebBrowserContextMenuEnabled = false,
                ObjectForScripting = new CalculatorBridge(this)
            };
            browser.DocumentCompleted += (s, e) => PrepareCalculatorPage();
            browser.Navigate(CALCULATOR_URL);
            this.Controls.Add(browser);

            ContextMenu trayMenu = new ContextMenu();
            trayMenu.MenuItems.Add("Toggle CalCU (" + HOTKEY_LABEL + ")", (s, e) => ToggleOverlay());
            trayMenu.MenuItems.Add("Reload Calculator", (s, e) => browser.Navigate(CALCULATOR_URL));
            trayMenu.MenuItems.Add("-");
            trayMenu.MenuItems.Add("Exit CalCU", (s, e) => {
                trayIcon.Visible = false;
                Application.Exit();
            });

            trayIcon = new NotifyIcon
            {
                Text = "CalCU - GATE Calculator (" + HOTKEY_LABEL + ")",
                Icon = SystemIcons.Application,
                ContextMenu = trayMenu,
                Visible = true
            };
            trayIcon.DoubleClick += (s, e) => ToggleOverlay();
        }

        private void PrepareCalculatorPage()
        {
            HtmlDocument doc = browser.Document;
            if (doc == null || doc.Body == null) return;
            doc.Body.Style = "margin:0;overflow:hidden;zoom:" +
                dpiScale.ToString(System.Globalization.CultureInfo.InvariantCulture);
            try
            {
                doc.InvokeScript("eval", new object[] { PAGE_SCRIPT });
            }
            catch { }
        }

        private int Scaled(int pixels)
        {
            return (int)Math.Round(pixels * dpiScale);
        }

        // Called from the page (see PAGE_SCRIPT) through CalculatorBridge.
        public void StartDrag()
        {
            ReleaseCapture();
            SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
        }

        public void HideOverlay()
        {
            this.Hide();
        }

        public void EscapePressed()
        {
            if (HIDE_ON_ESCAPE) this.Hide();
        }

        protected override void OnHandleCreated(EventArgs e)
        {
            base.OnHandleCreated(e);
            if (!RegisterHotKey(this.Handle, HOTKEY_ID, HOTKEY_MODIFIER, HOTKEY_KEY))
            {
                MessageBox.Show(
                    HOTKEY_LABEL + " is already used by another app, so CalCU cannot use it.\n\n" +
                    "Close that app, or download CalCU again with a different shortcut. " +
                    "You can still open CalCU from its tray icon.",
                    "CalCU",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning);
            }
        }

        protected override void OnHandleDestroyed(EventArgs e)
        {
            UnregisterHotKey(this.Handle, HOTKEY_ID);
            base.OnHandleDestroyed(e);
        }

        protected override void WndProc(ref Message m)
        {
            if (m.Msg == WM_HOTKEY && m.WParam.ToInt32() == HOTKEY_ID)
            {
                ToggleOverlay();
            }
            base.WndProc(ref m);
        }

        private void ToggleOverlay()
        {
            if (this.Visible)
            {
                this.Hide();
            }
            else
            {
                this.Show();
                this.WindowState = FormWindowState.Normal;
                this.Activate();
            }
        }

        // Makes the embedded WebBrowser use the IE11 engine instead of IE7.
        private static void SetBrowserFeatureControl()
        {
            try
            {
                string exeName = System.IO.Path.GetFileName(System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName);
                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION"))
                {
                    key.SetValue(exeName, 11001, RegistryValueKind.DWord);
                }
            }
            catch { }
        }

        [STAThread]
        public static void Main()
        {
            // Tell Windows CalCU handles display scaling itself (see dpiScale),
            // so it is not stretched into a blurry picture.
            SetProcessDPIAware();
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new OverlayForm());
        }
    }

    // What the calculator page can call as window.external.* (see PAGE_SCRIPT).
    [ComVisible(true)]
    public class CalculatorBridge
    {
        private readonly OverlayForm form;

        public CalculatorBridge(OverlayForm form)
        {
            this.form = form;
        }

        public void StartDrag() { form.StartDrag(); }
        public void HideCalculator() { form.HideOverlay(); }
        public void EscapePressed() { form.EscapePressed(); }
    }
}
