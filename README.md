# Samurai Run ⚔️

**Samurai Run** is an original modern 2D side-scrolling platformer built with HTML5 Canvas, CSS, and vanilla JavaScript.

> Run. Leap. Slash. Reach the gate.

## Play

Once GitHub Pages is enabled, play online at:

**https://everlastinguc.github.io/lal-hit-hahahahaha-meow/**

You can also run it locally: download or clone this repository and open `index.html` in a modern desktop browser. No build step, package manager, or dependencies are required.

## Controls

| Key | Action |
|---|---|
| `←` / `→` | Move |
| `Space` / `↑` | Jump (press again in the air for a double jump) |
| `X` | Sword slash |
| `R` | Restart the level |

## Current build — v0.1.0

- Original modern samurai character drawn with Canvas shapes
- Side-scrolling camera and layered parallax scenery
- Platforms, gaps, and double-jump movement
- Collectible gold coins and score counter
- Patrol enemies and sword combat
- Three health points, damage feedback, and game-over state
- Finish gate and level-clear state
- Responsive landing page and keyboard-first game UI

## Project structure

```text
.
├── index.html
├── styles.css
├── game.js
├── assets/
│   └── favicon.svg
└── .github/
    └── workflows/
        └── pages.yml
```

## Technology

- HTML5, CSS3, JavaScript (ES2020+)
- HTML Canvas 2D API
- GitHub Pages

No external game engine or runtime dependency is used. Google Fonts is an optional visual enhancement; system fonts remain the fallback.

## Roadmap

- [x] First playable village level
- [x] Movement, double jump, coins, enemies, sword attack and finish gate
- [ ] Character sprite sheets and polished animation states
- [ ] Sound effects and music
- [ ] More enemy types and environmental hazards
- [ ] Level select and world progression
- [ ] Boss encounters, checkpoints and save data
- [ ] Accessibility options and settings

## Development

Edit `game.js` for gameplay, `styles.css` for presentation, and `index.html` for page structure. Since the project has no build step, refresh the browser to test changes.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).

---

**Samurai Run** is an independent fan-inspired platformer project. It is not affiliated with or endorsed by Nintendo or any other game publisher.
