# Stickman Run 🏃‍♂️🚪

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/commiTino/viscon_test?quickstart=1)

A tiny jump & run game. Right now it's boring: run right, touch the door, you win.

**Your mission: make it as annoying as possible — only by asking the AI (Cline).**

## Getting started

1. Click the badge above and wait for the Codespace to load (a few minutes the first time).
2. Open a terminal (**Terminal → New Terminal**, or `` Ctrl+` ``) and start the game:
   ```bash
   npm start
   ```
   The game opens in a new browser tab. If it doesn't, open the **Ports** tab at the bottom
   and click the 🌐 globe next to port 3000. Leave this terminal running.
3. Open **Cline** (robot icon in the left sidebar). Click the ⚙️ gear, choose an API provider
   and paste the API key you were given.
4. Ask Cline for a feature and wait for it to finish. The game tab reloads by itself
   (refresh it if it doesn't). Play, then ask for the next feature.

Controls: **← →** / **A D** to run · **↑** / **W** / **Space** to jump · **R** to restart

## npm commands

Run these in the terminal, inside the project folder.

| Command | What it does |
|---|---|
| `npm start` | Starts the game on port 3000. It reloads by itself whenever `game.js` changes. |
| `Ctrl+C` | Stops the game (press it in the terminal where `npm start` runs). |
| `npm install` | Installs the dependencies again. Only needed if `npm start` says `vite: not found`. |

If `npm start` says port 3000 is already in use, the game is already running in another terminal.
Use that one, or stop it there with `Ctrl+C` first.

## Ideas

Start simple, then get evil:

- A hole in the ground you have to jump over
- Spikes that kill you
- A platform that moves up and down
- Spikes that pop out of the ground when you get close
- A fake door that kills you — the real one is somewhere else
- The door runs away when you get near it
- Controls flip every 10 seconds
- A floor that crumbles after you step on it
- Invisible blocks that you only find by bumping into them
- Level 2!

## Prompting tips

- **One feature per prompt.** Short prompts finish fast.
  ✅ "Add a hole in the middle of the ground."
  ❌ "Add holes, spikes, enemies, a level editor and a boss fight."
- **Say what's wrong.** "The spikes are too small to see" works better than "fix it".
- **Tune by asking.** "Make the platform move twice as fast."
- Broke something? Ask Cline to undo it, or use Cline's checkpoint ("Restore") button.

## Share your game

At the end of the session, **[submit your game here](https://github.com/commiTino/viscon_test/issues/new?template=submit-game.yml)**.
You need your game link: open the **Ports** tab, right-click port 3000 and choose **Copy Local Address**.

Keep your Codespace open until the presentation is over, otherwise the link stops working.

## How it works

The whole game is in [`game.js`](game.js): level data at the top, then physics, drawing and the main loop.
The canvas is 960 × 540 pixels, and y grows **downwards**.

---

<details>
<summary>Notes for organisers</summary>

- The dev container (`.devcontainer/`) uses Node 22, installs dependencies with `npm ci`,
  installs Cline and pre-seeds its state so it skips the "create an account" onboarding.
- Students start the game themselves with `npm start` (Vite on port 3000).
- `.clinerules` tells Cline how the game is structured and to keep changes small and fast
  (no new packages, no running commands, no browser testing).
- To test locally: open the folder in VS Code with the Dev Containers extension and run
  **Dev Containers: Reopen in Container**. Or just run `npm install && npm start`.

</details>
