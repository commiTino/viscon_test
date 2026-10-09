#!/usr/bin/env bash
# Pre-seed Cline's state so the "How will you use Cline?" onboarding (which
# pushes students towards creating a Cline account) is skipped. Students go
# straight to the chat and can enter their own API key in Cline's settings.
set -euo pipefail

STATE_DIR="${CLINE_DATA_DIR:-$HOME/.cline/data}"
STATE_FILE="$STATE_DIR/globalState.json"
mkdir -p "$STATE_DIR"

# Merge into any existing state instead of overwriting it.
node -e '
const fs = require("fs");
const file = process.argv[1];
let state = {};
try { state = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
state.welcomeViewCompleted = true;
fs.writeFileSync(file, JSON.stringify(state, null, 2));
' "$STATE_FILE"
