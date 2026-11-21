<div align="center">

# CalCU

### Your numerical practice needs focus. Not window resizing.
**Press `Alt + C` to summon the GATE Virtual Calculator anywhere on Windows or Linux. Press it again to vanish.**

<br />

**CalCU by [YouDO](https://youdo-app.vercel.app)** — so GATE, ESE, and PSU aspirants can solve numericals over PDFs and lectures on their laptop without switching windows or devices.

[**Download CalCU**](https://calcu-youdo.vercel.app) &nbsp; | &nbsp; [**Explore YouDO**](https://youdo-app.vercel.app) &nbsp; | &nbsp; [**YouDO Android APK**](https://github.com/mattedhairr/YouDO/releases) &nbsp; | &nbsp; [**Updates**](https://t.me/YouDO_Updates) &nbsp; | &nbsp; [**Join the discussion**](https://t.me/+-manVNAPhThkMzRl)

<br />

[![Release](https://img.shields.io/github/v/release/mattedhairr/CalCU?style=flat-square&color=C9A46E)](https://github.com/mattedhairr/CalCU/releases)
[![Platform](https://img.shields.io/badge/platform-Windows_10_%2F_11-8FB394?style=flat-square&logo=windows&logoColor=white)](./windows-overlay)
[![Platform](https://img.shields.io/badge/platform-Linux-8FB394?style=flat-square&logo=linux&logoColor=white)](./linux-overlay)
[![by YouDO](https://img.shields.io/badge/by-YouDO-C9A46E?style=flat-square)](https://github.com/mattedhairr/YouDO)
[![License](https://img.shields.io/badge/license-MIT-C9A46E?style=flat-square)](./LICENSE)
[![Telegram](https://img.shields.io/badge/Telegram-community-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://t.me/+-manVNAPhThkMzRl)

</div>

---

## Why CalCU exists

The official GATE exam gives you a post-fix virtual scientific calculator where keyboard typing is disabled and functions work in reverse (`30` then `sin`). Practicing with a physical Casio calculator builds the wrong muscle memory—but practicing with the browser calculator means constantly opening tabs, resizing windows, and `Alt + Tab`-ing away from your question PDF.

**CalCU** fixes that friction:
- **One Global Hotkey (`Alt + C`):** Summon the calculator directly on top of Adobe Acrobat, Edge, Chrome, or VLC.
- **Zero Context Switching:** Compute your value with the mouse and press `Alt + C` (or `Esc`) to hide it immediately.
- **Built for Deep Focus Sessions:** Stay inside your problem set and protect your net focus time.

---

## Quick Start on Windows (Zero Dependencies)

All native Windows scripts live in the [`/windows-overlay`](./windows-overlay) folder:

| 1. Install (`2 sec`) | 2. Solve (`Alt + C`) | 3. Uninstall (`1 click`) |
|---|---|---|
| Keep **`CalCU.cs`** next to it and double-click **`Install-CalCU.bat`** (or download the single-file installer from the website). It uses Windows' built-in `.NET` compiler (`csc.exe`) to build a tiny `~11 KB` **`CalCU.exe`** that runs from your system tray and starts with Windows (turn that off in Task Manager → Startup apps). | Press **`Alt + C`** over any PDF, test series, or video lecture to pop up or hide the GATE calculator. | Double-click **`Uninstall-CalCU.bat`** anytime to stop the process, delete `CalCU.exe`, and remove its startup entry and registry values. |

---

## Quick Start on Linux

Everything lives in the [`/linux-overlay`](./linux-overlay) folder. Keep **`calcu.py`** next to the installer (or download the single-file installer from the website), then run:

```bash
bash install-calcu.sh
```

- **What it needs:** Python, GTK 3 and WebKitGTK from your distribution's packages. If any are missing, the installer shows the command and asks before using `sudo`.
- **The shortcut:** Wayland doesn't let an app claim a global key itself, so the shortcut belongs to your desktop. On GNOME the installer sets `Alt + C` for you. On other desktops, add a custom shortcut in your keyboard settings that runs `~/.local/bin/calcu --toggle`.
- **Always on top:** CalCU runs through XWayland, so a desktop with no X11 support can't keep it on top.
- **What it installs:** files for your user only, in `~/.local` and `~/.config`, and it starts when you log in.
- **To remove it:** run `bash uninstall-calcu.sh`. It leaves the system packages in place, because other apps may use them.

---

## Is CalCU 100% Safe? (Security & Transparency)

**Yes — 100% transparent, plain-text, and compiled locally by Windows.**

1. **No Mystery Pre-Compiled Binaries:** Instead of asking you to trust an opaque `.exe` downloaded from the web, `Install-CalCU.bat` and `CalCU.cs` are **plain-text files**. You can right-click → **Edit in Notepad** and read every line of code before running.
2. **Compiled Locally by Microsoft Windows:** The script uses the official Microsoft C# compiler (`C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe`) pre-installed on every Windows 10 and Windows 11 PC.
3. **Zero Admin Rights Required:** Runs in standard user mode, uses ~15 MB RAM, installs no background services or drivers, and only registers your `Alt + C` shortcut via the standard Win32 `RegisterHotKey` API (`user32.dll`).

On Linux there is nothing to compile: `install-calcu.sh` and `calcu.py` are plain text too, and CalCU runs as your user. The only time it needs `sudo` is to install missing packages, and the installer asks first.

**Updates:** once a day CalCU reads the latest version number from [calcu-youdo.vercel.app/version.json](https://calcu-youdo.vercel.app/version.json), and sends nothing about you. When a newer version exists, it shows a notification once and adds "Update to …" to its tray menu; both open the website. Nothing downloads or installs by itself. Run the new installer to update: it removes everything from the old copy first. To turn the check off, set `CHECK_FOR_UPDATES` to false at the top of `CalCU.cs` or `calcu.py`.

---

## Copyright, Legal & Open-Source Ownership (MIT License)

1. **100% Original Clean-Room Code:** Every line of React, TypeScript, C#, Python, Shell, and Batch code in this repository is written from scratch under the **MIT License**.
2. **Functional Mechanics Are Not Copyrightable:** Mathematical formulas, post-fix button order, and scientific calculator layouts are utilitarian mechanics and are not subject to copyright protection.
3. **Zero Proprietary Assets Redistributed:** This repository does not host or redistribute any proprietary third-party code, images, or logos. When the overlay opens the official calculator URL inside a browser frame, it acts strictly as a lightweight user browser bookmark.
4. **Non-Affiliation Disclaimer:** *GATE* and *TCS iON* are trademarks/names of their respective owners. **CalCU** is an independent, student-built open-source study utility by **YouDO** and is not affiliated with or endorsed by them.

---

## About YouDO

CalCU is made by [**YouDO**](https://github.com/mattedhairr/YouDO). *Your exam plan is a tree. Not a to-do list.*

YouDO connects every part of your syllabus to the work you should finish now, then tracks what moved, what remains, and how much focused work you actually did. For UPSC, JEE, NEET, GATE, CAT and every serious preparation journey.

| 1. Build | 2. Schedule | 3. Focus | 4. Review |
|---|---|---|---|
| Map the whole syllabus as one tree, in your own names and as deep as it needs to go. | Send a whole task, or only the steps you will finish, to the day they belong. | Pause-aware sessions count real focus, not clock time, with an ambient clock and focus sounds. | Unfinished work stays in Backlog, and each day ends with net focus, streaks and goal progress. |

Free, open source and ad-free, with or without an account.

[**Get the Android app**](https://github.com/mattedhairr/YouDO/releases) &nbsp; · &nbsp; [**Open in browser**](https://youdo-app.vercel.app) &nbsp; · &nbsp; [**Telegram updates**](https://t.me/YouDO_Updates)

## License

Released under the [MIT License](./LICENSE). More by [Jatin Parmar (@mattedhairr)](https://github.com/mattedhairr).
