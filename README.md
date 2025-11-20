# Client Readiness Radar

Lightweight, front-end only visualization that blends a spider chart with a segmented capability ring. Use it as a selling aid to quickly show where a client is strong or needs support across eight dimensions.


## Customize the chart

1. Choose a dimension from the dropdown.
2. Drag the slider (0–4, 0.1 increments) to update that spoke’s score.
3. Repeat for each wedge you need to tailor for a specific client.

The spider polygon and inner wedge shading update immediately.

## Export options

- **Download PNG** – saves the current chart as a high-res image for slide decks.
- **Print** – opens a print-friendly window so you can generate a PDF or send to paper.

## Colors

- *Growth* dimensions (`Existing Business`, `New Business`, `GTM`) use the green family.
- *Product/Tech* uses orange.
- *Leadership/Ownership* and `Talent/Culture` share a blue family.
- *Ops/Systems* and `Financial Model` share a slate family.
- Inner wedges automatically tint to match their outer segment.

## Tweaks

Open `script.js` to change default scores, colors, or labels. Update `styles.css` for layout or typography changes.

