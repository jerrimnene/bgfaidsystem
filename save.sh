#!/bin/bash
cd /Users/providencemtendereki/bgf-aid-system
git add .
git commit -m "🧠 Auto-save: $(date)"
git push
zip -r ~/Desktop/bgf-aid-system-backup.zip .
echo "✅ Project auto-saved & zipped to Desktop!"
