# Form / Thought — modular portfolio starter

No build step, runtime packages or CDN required. Use Node 18+ for checks or Python 3 for serving.

## Run
From this directory: `python3 -m http.server 8000`, then open http://localhost:8000. ES modules require HTTP; do not double-click index.html.

## Edit
- `src/palette.js`: all theme colours and facet colours.
- `src/transitions.js`: scroll timing, morph phases, camera path and movement constants.
- `src/config.js`: name, headline, availability, email and résumé path.
- `src/graph/regions/*.js`: one content file per region; ordered in index.js.
- `src/graph/model.js`: irregular graph generation and connections.
- `src/graph/renderer.js`: perspective projection, drawing, node interaction, particle morph.
- `src/components/story.js`: semantic content, detail dialogs and contact UI.
- `src/components/portrait.js`: procedural bust fallback and custom mesh loading.
- `src/styles.css`: sharp editorial layout, responsive rules; colours come from palette.js.
- `attachments/`: images, models, documents.

## Behaviour
Text sampled into particles → irregular 3D graph → education → internships → projects → achievements → drawings → scattered particles → low-poly bust. Scroll backwards to reverse. Click region masters to navigate, drag empty canvas to orbit; hover and click child nodes for details. Semantic buttons expose the same details for keyboard and mobile visitors. Navigation offers direct project/contact access. Reduced-motion preference and a pause control suppress autonomous drift and smooth interpolation.

## Personalisation required
All text is editorial placeholder content, not verified personal claims. Set actual availability yourself. The procedural bust demonstrates the transition and is not a reconstruction of you. For your likeness provide a suitably sampled `attachments/portrait.json`; arbitrary GLB files are not supported in this dependency-free starter. The hero particle sampler matches the headline text, with a simplified canvas typography layout.

## Check
`node scripts/check.mjs` checks JS syntax, all local module imports, region order, graph geometry and timeline endpoints. Browser visual/performance verification is still needed on target devices.
