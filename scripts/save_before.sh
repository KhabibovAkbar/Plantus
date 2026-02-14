#!/bin/bash
# Copy the BEFORE base64 text to clipboard, then run:
# bash scripts/save_before.sh
echo "Paste the BEFORE base64, then press Ctrl+D:"
cat | base64 -D > assets/images/before_plantus.png
echo "✅ Saved before_plantus.png"
