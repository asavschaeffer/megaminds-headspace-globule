# SVG Composition Guide for AI-Assisted Art

## 1. Introduction

This guide provides a streamlined workflow for creating the Tier-0 SVG interaction maps used in this project. Following this process will ensure that all scenes are composed of perfectly interlocking, non-overlapping shapes.

The secondary goal is to produce a clean, high-contrast "composition map" from the final SVG. This map can be used as a source image for AI diffusion models (like Stable Diffusion) to generate high-quality, perfectly composed art for the Tier-1 visual layer.

## 2. Core Principles

-   **The Puzzle Piece Method:** Every SVG map must consist of multiple shapes that fit together like puzzle pieces. There should be **no gaps** and **no overlaps**.
-   **100% Coverage:** The shapes must collectively cover the entire `1920x2560` canvas.
-   **Shared Borders:** Adjacent shapes should share the exact same path coordinates along their border. This is the key to creating a seamless final product.

## 3. Recommended Tooling

For this workflow, a vector graphics editor is required. We recommend:
-   **Inkscape (Desktop, Free):** A powerful, open-source vector editor.
-   **Vectr (Web, Free):** A simple, easy-to-use online editor.
-   **Figma (Web, Freemium):** A professional-grade tool with excellent vector editing capabilities.

## 4. Step-by-Step Workflow

### Step 1: Set Up Your Canvas

1.  Create a new document.
2.  Set the canvas (or artboard) dimensions to **1920px width** by **2560px height**. This is our standard aspect ratio.

### Step 2: Draw the First Shape

1.  Select the **Pen Tool** (also known as the Bezier tool).
2.  Draw your first, most central, or most complex shape. Don't worry about making it perfect immediately; you can adjust the nodes (anchor points) later.

### Step 3: Draw Adjacent Shapes with Shared Borders

This is the most critical step.

1.  Select the **Pen Tool** again.
2.  To create a new shape that perfectly interlocks with the first, **begin by clicking on an existing node of the first shape**. This will ensure the two shapes share that exact point.
3.  Continue drawing the new shape's border. For every point that should touch the first shape, **click directly on the existing nodes of the first shape's path**.
4.  Draw the rest of the new shape's outline in the empty space on the canvas.
5.  Repeat this process for all shapes, always snapping to the existing nodes of adjacent shapes to create the shared borders.

### Step 4: Draw the Final Background Shape

1.  The last shape you draw should be the main background.
2.  Use the **Pen Tool** to trace the remaining empty space on the canvas, snapping to the exposed nodes of all the other shapes you've drawn.

### Step 5: Verification

1.  Temporarily set the background color of your canvas to a bright, obnoxious color (e.g., hot pink).
2.  If you see any of this color peeking through, it means you have a gap in your shapes. Adjust the nodes of your paths until the background is completely covered.

## 5. Exporting for the Project

1.  **Clean the SVG:** Save your file as a "Plain SVG" or "Optimized SVG" to remove unnecessary editor metadata.
2.  **Copy the Path Data:** Open the `.svg` file in a text editor and copy the `d` attribute from each of your `<path>` elements.
3.  **Integrate into `index.html`:** Paste the path data into the appropriate scene in `index.html`, following this template:

```html
<svg class="interaction-map" viewBox="0 0 1920 2560" preserveAspectRatio="xMidYMid slice">
    <a href="#link-1">
        <path d="[...paste your first path data here...]" fill="#[color1]"></path>
    </a>
    <a href="#link-2">
        <path d="[...paste your second path data here...]" fill="#[color2]"></path>
    </a>
    <a href="#link-3">
        <path d="[...paste your third path data here...]" fill="#[color3]"></path>
    </a>
</svg>
```

## 6. Exporting for AI Composition

This process creates a perfect visual guide for an AI art model.

1.  **Set High-Contrast Fills:** In your vector editor, set the fill color of each shape to a distinct, high-contrast color (e.g., pure red, green, blue). This makes it easy for the AI to understand the different regions.
2.  **Remove Strokes:** Ensure that all shapes have their stroke (outline) removed.
3.  **Export as PNG:** Export the entire canvas as a high-resolution PNG file (e.g., `1920x2560`).

You can now use this PNG image as an input for an AI model (e.g., in Stable Diffusion's `ControlNet` with the `canny` or `scribble` preprocessor). This will force the AI to generate its art within the precise boundaries of your composition, ensuring the final Tier-1 image perfectly matches the Tier-0 interactive map.
