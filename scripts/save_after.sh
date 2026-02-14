#!/bin/bash
# Copy the AFTER base64 text to clipboard, then run:
# bash scripts/save_after.sh
echo "Paste the AFTER base64, then press Ctrl+D:"
cat | base64 -D > assets/images/after_plantus.png
echo "✅ Saved after_plantus.png"
