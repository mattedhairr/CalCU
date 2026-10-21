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
        private Panel titleBar;

        public OverlayForm()
        {
            SetBrowserFeatureControl();

            this.Text = "CalCU - GATE Calculator (" + HOTKEY_LABEL + ")";
            this.FormBorderStyle = FormBorderStyle.None;
            this.Size = new Size(482, 368);
            this.TopMost = ALWAYS_ON_TOP;
            this.Opacity = WINDOW_OPACITY;
            this.ShowInTaskbar = false;
            this.BackColor = Color.FromArgb(51, 122, 183);

            Rectangle workArea = Screen.PrimaryScreen.WorkingArea;
            if (START_POSITION == "Center")
            {
                this.StartPosition = FormStartPosition.CenterScreen;
            }
            else
            {
                this.StartPosition = FormStartPosition.Manual;
                int top = START_POSITION == "BottomRight"
                    ? workArea.Bottom - this.Height - 24
                    : workArea.Top + 24;
                this.Location = new Point(workArea.Right - this.Width - 24, top);
            }

            titleBar = new Panel
            {
                Dock = DockStyle.Top,
                Height = 28,
                BackColor = Color.FromArgb(40, 96, 144),
                Cursor = Cursors.SizeAll
            };

            Label titleLabel = new Label
            {
                Text = "  CalCU by YouDO   [" + HOTKEY_LABEL + " to toggle]",
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 9F, FontStyle.Bold),
                AutoSize = false,
                Dock = DockStyle.Fill,
                TextAlign = ContentAlignment.MiddleLeft
            };

            Button hideBtn = new Button
            {
                Text = "Hide (" + HOTKEY_LABEL + ")",
                ForeColor = Color.White,
                BackColor = Color.FromArgb(51, 122, 183),
                FlatStyle = FlatStyle.Flat,
                Dock = DockStyle.Right,
                Width = 105,
                Font = new Font("Segoe UI", 8F, FontStyle.Regular),
                Cursor = Cursors.Hand
            };
            hideBtn.FlatAppearance.BorderSize = 0;
            hideBtn.Click += (s, e) => ToggleOverlay();

            titleLabel.MouseDown += DragWindow;
            titleBar.MouseDown += DragWindow;

            titleBar.Controls.Add(titleLabel);
            titleBar.Controls.Add(hideBtn);

            browser = new WebBrowser
            {
                Dock = DockStyle.Fill,
                ScrollBarsEnabled = false,
                ScriptErrorsSuppressed = true,
                IsWebBrowserContextMenuEnabled = false
            };
            browser.Navigate(CALCULATOR_URL);

            this.Controls.Add(browser);
            this.Controls.Add(titleBar);

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

            if (HIDE_ON_ESCAPE)
            {
                this.KeyPreview = true;
                this.KeyDown += (s, e) => { if (e.KeyCode == Keys.Escape) this.Hide(); };
            }
        }

        private void DragWindow(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
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
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new OverlayForm());
        }
    }
}
