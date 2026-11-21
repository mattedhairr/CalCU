#!/usr/bin/env bash
# ============================================================================
# CalCU by YouDO - Linux uninstaller. Run it with: bash uninstall-calcu.sh
#
# Removes only what install-calcu.sh added. Packages such as GTK are left alone,
# because other apps may use them.
# ============================================================================
set -u

BIN="$HOME/.local/bin/calcu"
GNOME_SCHEMA=org.gnome.settings-daemon.plugins.media-keys
GNOME_PATH=/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/calcu/

# Removes CalCU from GNOME's custom shortcuts, keeping all the others.
# Same as in install-calcu.sh; keep the two in step.
remove_gnome_shortcut() {
    command -v gsettings >/dev/null 2>&1 || return 0
    local list new_list
    list="$(gsettings get "$GNOME_SCHEMA" custom-keybindings 2>/dev/null)" || return 0
    case "$list" in
        *"'$GNOME_PATH'"*) ;;
        *) return 0 ;;
    esac
    new_list="${list//"'$GNOME_PATH', "/}"
    new_list="${new_list//", '$GNOME_PATH'"/}"
    new_list="${new_list//"'$GNOME_PATH'"/}"
    gsettings set "$GNOME_SCHEMA" custom-keybindings "$new_list"
    gsettings reset-recursively "$GNOME_SCHEMA.custom-keybinding:$GNOME_PATH"
}

echo "============================================================================"
echo "  CalCU by YouDO - Uninstaller"
echo "============================================================================"
echo

echo "[1/3] Stopping CalCU..."
[ -x "$BIN" ] && "$BIN" --quit >/dev/null 2>&1

echo "[2/3] Removing CalCU, starting at login and its saved state..."
rm -f "$BIN" \
    "$HOME/.local/share/applications/com.mattedhairr.CalCU.desktop" \
    "$HOME/.local/share/applications/calcu.desktop" \
    "$HOME/.config/autostart/calcu.desktop"
rm -rf "$HOME/.config/calcu"

echo "[3/3] Removing the keyboard shortcut..."
remove_gnome_shortcut

echo
echo "============================================================================"
echo "  Done. CalCU has been removed."
echo "  If you added the shortcut by hand, remove it in your keyboard settings."
echo "============================================================================"
