# Mountain Journey

This project creates a vertical, scroll-snapping journey through a series of interactive scenes. Each scene fills the viewport and can have multiple layers: a base interaction layer (visible by default) and an optional high-fidelity visual layer that loads on faster connections.

## Project Structure

- `index.html`: The main HTML file containing the structure for all scenes.
- `styles.css`: The stylesheet that controls the layout, appearance, and responsiveness of the scenes.
- `enhancer.js`: A script that detects network speed and upgrades the user to a higher "tier" by loading background images if the connection is sufficient.
- `images/`: Directory containing all visual assets.

## Scene Architecture

The application is built as a series of "scenes" within a `main.scroll-container`. Each scene is a `div` with the class `scene-container`.

### Key Concepts

1.  **Scroll Snapping:** The `main.scroll-container` uses `scroll-snap-type: y mandatory` to ensure that users scroll cleanly from one scene to the next. Each `.scene-container` has `scroll-snap-align: center`.

2.  **Tiered Loading (Progressive Enhancement):**
    -   **Tier 0 (Default):** All users get a basic, fast-loading experience using simple colored backgrounds defined in the CSS. This is the baseline experience.
    -   **Tier 1 (Enhanced):** The `enhancer.js` script checks the user's connection speed. If it's faster than a 2G connection, it adds a `tier-1` class to the `<body>`. This class triggers CSS rules that load a high-resolution background image (`.visual-layer`) and makes the colored backgrounds transparent so the image can be seen.

3.  **Interaction Layers:** Each scene has an interactive layer. This can be an SVG map with clickable paths (like Scene 1) or a flexbox layout of clickable `<a>` tags (like Scene 2).

## How to Add a New Scene

Follow this methodology to add a new scene to the journey.

### 1. Add the HTML Structure

In `index.html`, add a new `<div class="scene-container">` inside the `<main class="scroll-container">`. Give it a unique ID (e.g., `#scene-new`).

```html
<!-- Scene 3: New Scene -->
<div id="scene-new" class="scene-container">
    <!-- Visual Layer (for Tier 1) -->
    <img data-src="images/your-new-image.jpeg" class="visual-layer" alt="Descriptive alt text.">

    <!-- Interaction Layer (for Tier 0 and all tiers) -->
    <a href="#link1" id="new-section-1">
        <div class="new-section-1-bg"></div>
    </a>
    <a href="#link2" id="new-section-2">
        <div class="new-section-2-bg"></div>
    </a>
</div>
```

-   **`visual-layer`**: The `<img>` tag points to the high-resolution image for the scene in its `data-src` attribute. The `src` is left empty and will be populated by `enhancer.js` for Tier 1 users.
-   **Interaction `<a>` tags**: These are the clickable regions. Give them unique IDs for layout control.
-   **Background `<div>`s**: These provide the colored background for Tier 0. Give them classes for styling.

### 2. Add the CSS Styles

In `styles.css`, add the necessary styles for your new scene.

```css
/* --- Scene 3 Layout --- */
#scene-new {
    display: flex;
    flex-direction: column; /* or 'row' */
    position: relative;
}

/* Size the clickable areas */
#scene-new #new-section-1 {
    height: 20vh; /* Example size */
}
#scene-new #new-section-2 {
    flex: 1; /* Takes remaining space */
}

/* Style the Tier 0 backgrounds */
#scene-new .new-section-1-bg {
    background-color: #somecolor;
}
#scene-new .new-section-2-bg {
    background-color: #anothercolor;
}

/* Define the hover effect for the new scene */
#scene-new a:hover > div {
    background-color: rgba(255, 255, 0, 0.3) !important; 
}

/* Make backgrounds transparent for Tier 1 to reveal the image */
.tier-1 #scene-new .new-section-1-bg,
.tier-1 #scene-new .new-section-2-bg {
    background-color: transparent;
}
```

### 3. Add Images

Place your new background image in the `images/` directory.

By following this structure, the new scene will automatically integrate into the scroll-snapping layout and support the progressive enhancement system.
