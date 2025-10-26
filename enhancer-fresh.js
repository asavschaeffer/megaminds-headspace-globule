// Sol Eremus - Minimal Interaction Enhancement
// Keeps it simple, keeps it smooth

(function() {
  'use strict';

  // Debug state
  let debugMode = false;

  // Smooth scroll for internal anchor links
  function setupSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Optional: Fade transition for external links
  function setupExternalLinks() {
    const externalLinks = document.querySelectorAll('a:not([href^="#"])');

    externalLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // If you want a fade transition, uncomment below:
        // e.preventDefault();
        // document.body.style.opacity = '0';
        // setTimeout(() => {
        //   window.location.href = this.href;
        // }, 300);
      });
    });
  }

  // Debug mode toggle
  function toggleDebugMode() {
    debugMode = !debugMode;
    document.body.classList.toggle('debug-zones', debugMode);

    console.log(
      `%c🔍 Debug Mode: ${debugMode ? 'ON' : 'OFF'}`,
      `font-size: 16px; font-weight: bold; color: ${debugMode ? '#00ff00' : '#ff6b6b'}`
    );

    if (debugMode) {
      console.log('%cZone boundaries are now visible', 'color: #4fc3f7');
      console.log('%cPress D again to hide', 'color: #999');
    }
  }

  // Keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Press 'D' for debug mode
      if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
        // Only if not typing in an input
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          toggleDebugMode();
        }
      }
      // Press 'B' to toggle blend tester panel
      if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey) {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          document.body.classList.toggle('show-blend-panel');
        }
      }
    });
  }

  // Expose debug toggle to console
  window.toggleDebug = toggleDebugMode;

  // Blend mode tester for HEADSPACE label
  window.tryBlendMode = function(mode) {
    const skyLabel = document.querySelector('.zone-label-sky');
    if (!skyLabel) {
      console.log('%c❌ Sky label not found', 'color: #ff6b6b');
      return;
    }

    const validModes = [
      'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
      'color-dodge', 'color-burn', 'hard-light', 'soft-light',
      'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
    ];

    if (!validModes.includes(mode)) {
      console.log(
        `%c❌ Invalid mode. Try: ${validModes.join(', ')}`,
        'color: #ff6b6b'
      );
      return;
    }

    skyLabel.style.mixBlendMode = mode;
    console.log(
      `%c✨ HEADSPACE blend mode: ${mode}`,
      'font-size: 14px; color: #4fc3f7; font-weight: bold'
    );
  };

  // Quick presets for common good-looking modes
  window.blendPresets = {
    embedded: () => window.tryBlendMode('overlay'),
    glowing: () => window.tryBlendMode('screen'),
    subtle: () => window.tryBlendMode('soft-light'),
    dramatic: () => window.tryBlendMode('hard-light'),
    atmospheric: () => window.tryBlendMode('multiply'),
    dreamy: () => window.tryBlendMode('lighten')
  };

  // Auto-apply aria-labels to zones using their visible label text
  function applyAriaLabelsFromText() {
    const zones = document.querySelectorAll('.zone');
    zones.forEach((zone) => {
      if (!zone.getAttribute('aria-label')) {
        const label = zone.querySelector('.zone-label');
        if (label && label.textContent.trim()) {
          zone.setAttribute('aria-label', label.textContent.trim());
        }
      }
      // Make zones focusable for keyboard nav
      if (!zone.hasAttribute('tabindex')) {
        zone.setAttribute('tabindex', '0');
      }
    });
  }

  function setupBlendPanel() {
    const select = document.getElementById('blendSelect');
    const applyBtn = document.getElementById('blendApply');
    if (!select || !applyBtn) return;

    // Initialize select to current computed style of the label if possible
    const skyLabel = document.querySelector('.zone-label-sky');
    if (skyLabel) {
      const cs = getComputedStyle(skyLabel);
      const current = cs.mixBlendMode || 'overlay';
      const opt = Array.from(select.options).find(o => o.value === current);
      if (opt) select.value = current;
    }

    applyBtn.addEventListener('click', () => {
      const mode = select.value;
      window.tryBlendMode(mode);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupSmoothScroll();
      setupExternalLinks();
      setupKeyboardShortcuts();
      applyAriaLabelsFromText();
      setupBlendPanel();
      console.log('%c💡 Press D to toggle zone boundaries', 'color: #4fc3f7; font-size: 12px');
      console.log('%c💡 Try blend modes: tryBlendMode("screen")', 'color: #4fc3f7; font-size: 12px');
      console.log('%c💡 Or quick presets: blendPresets.glowing()', 'color: #4fc3f7; font-size: 12px');
      console.log(
        '%cAvailable presets: embedded, glowing, subtle, dramatic, atmospheric, dreamy',
        'color: #999; font-size: 10px'
      );
      console.log('%c💡 Press B to toggle in-page blend tester', 'color: #4fc3f7; font-size: 12px');
    });
  } else {
    setupSmoothScroll();
    setupExternalLinks();
    setupKeyboardShortcuts();
    applyAriaLabelsFromText();
    setupBlendPanel();
    console.log('%c💡 Press D to toggle zone boundaries', 'color: #4fc3f7; font-size: 12px');
    console.log('%c💡 Try blend modes: tryBlendMode("screen")', 'color: #4fc3f7; font-size: 12px');
    console.log('%c💡 Or quick presets: blendPresets.glowing()', 'color: #4fc3f7; font-size: 12px');
    console.log(
      '%cAvailable presets: embedded, glowing, subtle, dramatic, atmospheric, dreamy',
      'color: #999; font-size: 10px'
    );
    console.log('%c💡 Press B to toggle in-page blend tester', 'color: #4fc3f7; font-size: 12px');
  }

})();
