#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Checking repo…"
test -f package.json || { echo "Run this from the project root (package.json not found)."; exit 1; }

# 1) Remove conflicting Tailwind v4 config files if present
echo "🧹 Removing conflicting Tailwind v4 configs (if any)…"
rm -f postcss.config.mjs tailwind.config.ts

# 2) Write stable PostCSS v8 config
echo "📝 Writing postcss.config.js…"
cat > postcss.config.js <<'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# 3) Write stable Tailwind v3 config
echo "📝 Writing tailwind.config.js…"
cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif','system-ui','-apple-system','Inter','Arial','sans-serif'],
        mono: ['ui-monospace','SFMono-Regular','Menlo','monospace'],
      },
      colors: {
        ink: "#0b1020",
        neon: "#00b9fc",
        myst: "#0c122b",
      },
      boxShadow: { glow: "0 0 60px rgba(0,185,252,0.18)" },
    },
  },
  plugins: [],
};
EOF

# 4) Ensure Tailwind directives live in globals.css
if [ -f src/app/globals.css ]; then
  if ! grep -q "@tailwind base;" src/app/globals.css; then
    echo "🔧 Injecting Tailwind directives at top of src/app/globals.css…"
    cp src/app/globals.css src/app/globals.css.bak
    cat > src/app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

EOF
    cat src/app/globals.css.bak >> src/app/globals.css
    rm -f src/app/globals.css.bak
  fi
else
  echo "⚠️  src/app/globals.css not found. Skipping directive check."
fi

# 5) Fix the typewriter "undefined" bug
if [ -f src/components/vn/DialogBox.tsx ]; then
  echo "📝 Patching src/components/vn/DialogBox.tsx…"
  cat > src/components/vn/DialogBox.tsx <<'EOF'
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DialogBox({ text, speaker }: { text: string; speaker?: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplay("");
    const id = setInterval(() => {
      if (i < text.length) {
        setDisplay(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(id);
      }
    }, 12);
    return () => clearInterval(id);
  }, [text]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="v-card mt-4">
      {speaker && <div className="text-neon font-semibold mb-2">{speaker}</div>}
      <p className="leading-relaxed whitespace-pre-wrap">{display}</p>
    </motion.div>
  );
}
EOF
else
  echo "ℹ️  DialogBox.tsx not found (skipping bug fix)."
fi

# 6) Update package.json to stable Tailwind v3 + PostCSS v8
echo "📝 Updating package.json dependencies via Node helper…"
node <<'EOF'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));

function ensure(obj, key, val) {
  obj[key] = val;
}
function removeDep(key) {
  if (pkg.dependencies && pkg.dependencies[key]) delete pkg.dependencies[key];
  if (pkg.devDependencies && pkg.devDependencies[key]) delete pkg.devDependencies[key];
}

pkg.scripts = Object.assign({
  dev: "next dev",
  build: "next build",
  start: "next start"
}, pkg.scripts || {});

// Remove Tailwind v4 related
removeDep('@tailwindcss/postcss');

// Pin Tailwind v3 + PostCSS + Autoprefixer
pkg.devDependencies = pkg.devDependencies || {};
ensure(pkg.devDependencies, 'tailwindcss', '^3.4.16');
ensure(pkg.devDependencies, 'postcss', '^8.4.49');
ensure(pkg.devDependencies, 'autoprefixer', '^10.4.20');

// Keep TypeScript modern
if (!pkg.devDependencies.typescript) {
  ensure(pkg.devDependencies, 'typescript', '^5.6.3');
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('package.json updated.');
EOF

# 7) Fresh install & local prod build check
echo "📦 Installing…"
npm i

echo "🏗️ Building (prod)…"
npm run build

# 8) Commit & push
echo "🔐 Committing and pushing…"
git add -A
git commit -m "fix: tailwind v3/postcss config, remove v4, dialog typewriter guard" || echo "Nothing to commit."
git push || echo "⚠️ Could not push automatically. Push manually if needed."

echo
echo "✅ Done!"
echo "Next:"
echo "1) Go to Vercel → Project → Deployments → Redeploy → **Clear Build Cache and Redeploy**."
echo "2) Verify styles + typewriter are correct."
echo "3) If you see unstyled HTML again, confirm only these exist at repo root:"
echo "   - postcss.config.js"
echo "   - tailwind.config.js"
echo "   - package.json with tailwindcss ^3.4.x"
echo
