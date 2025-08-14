// enhancer.js
// Test, don't guess. Give JS full control over loading.
(function() {
    'use strict';

    const visualLayers = document.querySelectorAll('.visual-layer');
    if (visualLayers.length === 0) return;

    // --- Tier Detection ---
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    const effectiveType = connection.effectiveType || '4g';

    if (effectiveType.includes('2g')) {
        console.log('Slow connection (' + effectiveType + '). Staying at Tier 0.');
        return; // Do not load images.
    }

    // --- Capability Testing ---
    const webpTest = new Image();
    webpTest.onload = function() {
        // Connection is good, WebP/JPEG is supported. Load the images.
        console.log('Upgrading to Tier 1: Loading images.');
        document.body.classList.add('tier-1');
        visualLayers.forEach(layer => {
            layer.src = layer.dataset.src;
        });
    };
    webpTest.onerror = function() {
        console.log('Image format support check failed. Staying at Tier 0.');
    };
    
    // Check for WebP, but we will load JPEGs too.
    webpTest.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

})();