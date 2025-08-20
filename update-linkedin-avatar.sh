#!/usr/bin/env bash
set -euo pipefail

# ===== Settings =====
LINKEDIN_HANDLE="aditya-singh-9b1193261"   # <-- change if needed
SCENE_FILE="src/components/vn/SceneWrapper.tsx"

echo "🔎 Ensuring project root..."
test -f package.json || { echo "Run this from your project root."; exit 1; }

echo "🖼️  Fetching LinkedIn avatar via Unavatar..."
mkdir -p public
curl -fsSL "https://unavatar.io/linkedin/${LINKEDIN_HANDLE}" -o public/avatar.png

if [ ! -s public/avatar.png ]; then
  echo "❌ Could not fetch avatar. Double-check the LinkedIn handle: ${LINKEDIN_HANDLE}"
  exit 1
fi

echo "🧭 Updating header avatar in $SCENE_FILE ..."
test -f "$SCENE_FILE" || { echo "Could not find $SCENE_FILE — update the path if your header lives elsewhere."; exit 1; }

# Ensure next/image import
if ! grep -q 'from "next/image"' "$SCENE_FILE"; then
  awk 'NR==1{print; print "import Image from \"next/image\";"; next}1' "$SCENE_FILE" > "$SCENE_FILE.tmp" && mv "$SCENE_FILE.tmp" "$SCENE_FILE"
  echo "✅ Added: import Image from \"next/image\";"
fi

# Prefer updating an existing <Image ... src="...">; otherwise replace placeholder circle
perl -0777 -pe '
  # 1) If there is already an Image tag in the header, just point it to /avatar.png
  s#(<Image[^>]*\bsrc=)["'\''][^"'\'']+(["'\''])#\1"/avatar.png"\2#s
' -i "$SCENE_FILE"

# If no Image was present before (or replacement failed), swap the decorative circle div
if ! grep -q '/avatar.png' "$SCENE_FILE"; then
  perl -0777 -pe '
    s#<div className="h-9 w-9 rounded-full[^>]*/>\s*#<a href="https://www.linkedin.com/in/'"$LINKEDIN_HANDLE"'" target="_blank" rel="noreferrer" className="inline-block" aria-label="View LinkedIn profile">\n  <Image src="/avatar.png" alt="Aditya Singh" width="40" height="40" className="rounded-full border-2 border-blue-400 shadow-md hover:shadow-blue-500/50 transition" />\n</a>\n#s
  ' -i "$SCENE_FILE"
fi

echo "🏗️ Building (prod)…"
npm run build

echo "📝 Committing changes…"
git add -A
git commit -m "feat: use LinkedIn avatar (downloaded to public/avatar.png) in header" || echo "Nothing to commit."

echo "☁️ Deploying to Vercel (prod)…"
npx vercel --prod

echo "✅ Done! Your site now uses your LinkedIn profile picture."
echo "   If you change your LinkedIn photo later, re-run this script to refresh public/avatar.png."
