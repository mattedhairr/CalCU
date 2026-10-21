<div align="center">

# CalCU

### Your numerical practice needs focus. Not window resizing.
**Press `Alt + C` to summon the GATE Virtual Calculator anywhere on Windows. Press it again to vanish.**

<br />

**CalCU by [YouDO](https://youdo-app.vercel.app)** — so GATE, ESE, and PSU aspirants can solve numericals over PDFs and lectures on their laptop without switching windows or devices.

[**Download CalCU**](https://calcu-youdo.vercel.app) &nbsp; | &nbsp; [**Explore YouDO**](https://youdo-app.vercel.app) &nbsp; | &nbsp; [**YouDO Android APK**](https://github.com/mattedhairr/YouDO/releases) &nbsp; | &nbsp; [**Updates**](https://t.me/YouDO_Updates) &nbsp; | &nbsp; [**Join the discussion**](https://t.me/+-manVNAPhThkMzRl)

<br />

[![Platform](https://img.shields.io/badge/platform-Windows_10_%2F_11-8FB394?style=flat-square&logo=windows&logoColor=white)](./windows-overlay)
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
| Keep **`CalCU.cs`** next to it and double-click **`Install-CalCU.bat`** (or download the single-file installer from the website). It uses Windows' built-in `.NET` compiler (`csc.exe`) to build a tiny `~11 KB` **`CalCU.exe`** that runs from your system tray and starts with Windows (turn that off in Task Manager → Startup apps). | Press **`Alt + C`** over any PDF, test series, or video lecture to pop up or hide the GATE calculator. | Double-click **`Uninstall-CalCU.bat`** anytime to stop the process, delete `CalCU.exe`, and remove its startup entry and registry value. |

---

## Is CalCU 100% Safe? (Security & Transparency)

**Yes — 100% transparent, plain-text, and compiled locally by Windows.**

1. **No Mystery Pre-Compiled Binaries:** Instead of asking you to trust an opaque `.exe` downloaded from the web, `Install-CalCU.bat` and `CalCU.cs` are **plain-text files**. You can right-click → **Edit in Notepad** and read every line of code before running.
2. **Compiled Locally by Microsoft Windows:** The script uses the official Microsoft C# compiler (`C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe`) pre-installed on every Windows 10 and Windows 11 PC.
3. **Zero Admin Rights Required:** Runs in standard user mode, uses ~15 MB RAM, installs no background services or drivers, and only registers your `Alt + C` shortcut via the standard Win32 `RegisterHotKey` API (`user32.dll`).

---

## Copyright, Legal & Open-Source Ownership (MIT License)

1. **100% Original Clean-Room Code:** Every line of React, TypeScript, C#, and Batch code in this repository is written from scratch under the **MIT License**.
2. **Functional Mechanics Are Not Copyrightable:** Mathematical formulas, post-fix button order, and scientific calculator layouts are utilitarian mechanics and are not subject to copyright protection.
3. **Zero Proprietary Assets Redistributed:** This repository does not host or redistribute any proprietary third-party code, images, or logos. When the Windows overlay opens the official calculator URL inside a `WebBrowser` frame, it acts strictly as a lightweight user browser bookmark.
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
