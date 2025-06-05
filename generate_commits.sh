#!/usr/bin/env bash
set -e

# 30 plain commit messages
messages=(
  "initialize project boilerplate (index.html, style.css, script.js)"
  "add basic header, nav and footer structure"
  "add global reset and base typography"
  "implement sticky header and responsive nav layout"
  "add nav-toggle JavaScript for mobile menu"
  "create hero section with banner and CTA button"
  "hero overlay and text styling"
  "build gallery page HTML structure"
  "gallery-grid layout and card styling"
  "implement flip-card markup for gallery items"
  "flip-card CSS transitions, perspective and backface-visibility"
  "add Developer photo card with badge"
  "ensure badge shows via positioning context on flip-card-inner"
  "create game page and basic game-container grid"
  "game-card hover state and fact-reveal with pseudo-element"
  "wire up game logic placeholder in script.js"
  "add contact form HTML structure"
  "form-container styling and input focus states"
  "unify button styles across site"
  "consolidate duplicate rules and refactor CSS sections"
  "add media queries for mobile responsiveness"
  "adjust grid layouts / image sizes on small screens"
  "introduce vibrant gradient navbar background"
  "pill-style nav links with hover/active animations"
  "ensure nav always shows on desktop and toggles on mobile"
  "add hero background image asset"
  "import cartoon-style fruit images"
  "reference cartoon fruit images in gallery"
  "update README with project overview and setup instructions"
  "final cleanup—remove unused assets and verify site-wide consistency"
)

# Shuffle the messages
mapfile -t shuffled < <(printf "%s
" "${messages[@]}" | shuf)

# Starting 10 days ago
start_date=$(date -d '10 days ago' +%Y-%m-%d)

# Create 3 commits per day for 10 days
for day in $(seq 0 9); do
  current_date=$(date -d "$start_date +$day day" +%Y-%m-%d)
  for i in {0..2}; do
    idx=$(( day*3 + i ))
    msg="${shuffled[$idx]}"

    # Random time between 09:00 and 18:59
    hour=$(printf "%02d" $(( RANDOM % 10 + 9 )))
    minute=$(printf "%02d" $(( RANDOM % 60 )))
    second=$(printf "%02d" $(( RANDOM % 60 )))
    timestamp="$current_date $hour:$minute:$second"

    git add .
    GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" \
      git commit --allow-empty -m "$msg"
  done
done

echo "✅ 30 empty commits created over the last 10 days."
