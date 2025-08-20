#!/usr/bin/env bash
set -euo pipefail

# ==== Settings ====
LINKEDIN_HANDLE="aditya-singh-9b1193261"
GITHUB_HANDLE="KagOnGit"
SCENE_FILE="src/components/vn/SceneWrapper.tsx"

echo "🔎 Checking project root…"
test -f package.json || { echo "Run from the project root (package.json not found)."; exit 1; }

mkdir -p public

echo "🖼  Fetching LinkedIn avatar as PNG (no HTML fallback)…"
# Ask unavatar for PNG; if it can't resolve, we'll fallback to GitHub.
curl -fsSL "https://unavatar.io/linkedin/${LINKEDIN_HANDLE}?format=png&fallback=false" -o public/avatar.png || true

# Validate file is a real PNG and not too tiny.
IS_PNG=$(file -b --mime-type public/avatar.png 2>/dev/null || echo "missing")
SIZE=$(stat -f%z public/avatar.png 2>/dev/null || stat -c%s public/avatar.png 2>/dev/null || echo 0)

if [ "$IS_PNG" != "image/png" ] || [ "${SIZE:-0}" -lt 1000 ]; then
  echo "⚠️  LinkedIn avatar not valid (type=$IS_PNG size=${SIZE}). Falling back to GitHub…"
  curl -fsSL "https://unavatar.io/github/${GITHUB_HANDLE}?format=png" -o public/avatar.png || true
fi

# Double-check again
IS_PNG=$(file -b --mime-type public/avatar.png 2>/dev/null || echo "missing")
SIZE=$(stat -f%z public/avatar.png 2>/dev/null || stat -c%s public/avatar.png 2>/dev/null || echo 0)
if [ "$IS_PNG" != "image/png" ] || [ "${SIZE:-0}" -lt 1000 ]; then
  echo "⚠️  Could not obtain avatar via services. Using existing avatar if valid..."
  if [ "$IS_PNG" = "image/png" ] && [ "${SIZE:-0}" -gt 500 ]; then
    echo "✅ Using existing avatar: public/avatar.png (${SIZE} bytes)"
  else
    echo "❌ No valid avatar available. Aborting."
    exit 1
  fi
fi
echo "✅ Avatar saved: public/avatar.png (${SIZE} bytes)"

echo "🛟 Creating a local fallback avatar (initials SVG)…"
cat > public/avatar-fallback.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="24" fill="url(#g)"/>
  <text x="50%" y="55%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="64" fill="white">AS</text>
</svg>
EOF

echo "🧭 Updating header to use /avatar.png with error fallback…"
test -f "$SCENE_FILE" || { echo "Could not find $SCENE_FILE — update SCENE_FILE path and re-run."; exit 1; }

# Ensure next/image import
if ! grep -q 'from "next/image"' "$SCENE_FILE"; then
  awk 'NR==1{print; print "import Image from \"next/image\";"; next}1' "$SCENE_FILE" > "$SCENE_FILE.tmp" && mv "$SCENE_FILE.tmp" "$SCENE_FILE"
  echo "✅ Added: import Image from \"next/image\""
fi

# Inject a tiny hook-based component for resilient avatar rendering
AVATAR_SNIPPET='
function HeaderAvatar() {
  const [src, setSrc] = React.useState("/avatar.png");
  return (
    <a href="https://www.linkedin.com/in/'"$LINKEDIN_HANDLE"'" target="_blank" rel="noreferrer" aria-label="View LinkedIn profile" className="inline-block">
      <Image
        src={src}
        alt="Aditya Singh"
        width={40}
        height={40}
        priority
        onError={() => setSrc("/avatar-fallback.svg")}
        className="rounded-full border-2 border-blue-400 shadow-md hover:shadow-blue-500/50 transition"
      />
    </a>
  );
}
'

# Add React import if missing (client component already uses React in Next 13+ implicitly, but be safe)
if ! grep -q "import React" "$SCENE_FILE"; then
  awk 'NR==1{print; print "import React from \"react\";"; next}1' "$SCENE_FILE" > "$SCENE_FILE.tmp" && mv "$SCENE_FILE.tmp" "$SCENE_FILE"
fi

# Inject HeaderAvatar if not present
if ! grep -q "function HeaderAvatar()" "$SCENE_FILE"; then
  # Append right after other imports
  awk -v snip="$AVATAR_SNIPPET" '
    NR==1{print; next}
    FNR==2{print snip}
    {print}
  ' "$SCENE_FILE" > "$SCENE_FILE.tmp" && mv "$SCENE_FILE.tmp" "$SCENE_FILE"
fi

# Replace the old circle or old Image with <HeaderAvatar />
perl -0777 -pe '
  s#<div className="h-9 w-9 rounded-full[^>]*/>\s*#<HeaderAvatar />#s;
  s#<Image[^>]+>#<HeaderAvatar />#s if $.==1;
' -i "$SCENE_FILE"

# If replacement didn't take (no HeaderAvatar usage yet), put it before the name block
if ! grep -q "<HeaderAvatar" "$SCENE_FILE"; then
  perl -0777 -pe '
    s#(<div className="flex items-center gap-3">\s*)#\1<HeaderAvatar />#s
  ' -i "$SCENE_FILE"
fi

echo "🏗  Building (prod)…"
npm run build

echo "📝 Committing…"
git add -A
git commit -m "feat: robust LinkedIn avatar with PNG fetch + local fallback and onError handling" || echo "Nothing to commit."

echo "☁️ Deploying to Vercel (prod)…"
npx vercel --prod

echo "✅ Done! Your header now uses /avatar.png with a resilient fallback."
echo "   Tip: open /avatar.png directly on your site to verify the actual file Vercel serves."
