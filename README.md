# Beach Body

A personal, phone-first log for food, training and body progress, built for a swimmer's-physique goal and an Indian vegetarian-plus-chicken diet.

It is a static web app with no server and no accounts. Everything you enter, progress photos included, is stored in your browser's IndexedDB on the device you use it on. Nothing is uploaded. Use **Settings → Download backup** regularly.

A passcode keeps other people out of the app: each device asks for it once. `access.json` holds only a random salt and a PBKDF2-SHA256 hash of the passcode. To set or change it, run `powershell -ExecutionPolicy Bypass -File tools\set-passcode.ps1`, then commit `access.json`.

## Features

- **Food:** instant search across a hand-checked list of common Indian foods, your saved foods, saved meals and recent items. Optionally, the [Indian Nutrient Databank](https://github.com/lindsayjaacks/Indian-Nutrient-Databank-INDB-) (Jaacks Lab, University of Edinburgh) is downloaded once from its source onto your device. Macros plus 12 micronutrients per day.
- **Claude estimates (optional):** uses Claude Haiku 5.5. For a dish that isn't in the database, photograph it or describe it and Claude estimates the nutrition. Every estimated item is saved so it's an instant search next time. Uses your own Anthropic API key, kept on your device and sent only to `api.anthropic.com`.
- **Training:** Hevy workouts pasted from their web page (read on the device, no AI), cardio logging, and a Sunday-to-Saturday week view.
- **Body:** daily weight with a 7-day average, weekly measurements, and front/side/back progress photos with side-by-side comparison.
- **Trends:** calories, protein, steps and weight charts, a weekly fat-loss rate check, and an optional weekly review written by Claude.

## Install

Open the site in Chrome on your phone, tap ⋮, then **Install app** or **Add to Home screen**. It works offline after the first load.

## Development

Plain HTML, CSS and JavaScript with no build step. Serve the folder with any static server, for example `npx serve .`. The service worker only registers over HTTPS.
