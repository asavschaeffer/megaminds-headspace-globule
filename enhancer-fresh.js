// Sol Eremus - Scene Enhancement
// SVG sprite loading, smooth scroll, debug tools, welcome modal

(function() {
  'use strict';

  // ========================================
  // STATE
  // ========================================
  const WELCOME_STORAGE_KEY = 'sol-eremus-welcome-shown';
  let debugMode = false;
  let spriteInjected = false;

  // ========================================
  // SMOOTH SCROLL
  // ========================================

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

  // ========================================
  // DEBUG MODE
  // ========================================

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

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          toggleDebugMode();
        }
      }
      if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey) {
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          document.body.classList.toggle('show-blend-panel');
        }
      }
    });
  }

  window.toggleDebug = toggleDebugMode;

  // ========================================
  // BLEND MODE TESTER
  // ========================================

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

  window.blendPresets = {
    embedded: () => window.tryBlendMode('overlay'),
    glowing: () => window.tryBlendMode('screen'),
    subtle: () => window.tryBlendMode('soft-light'),
    dramatic: () => window.tryBlendMode('hard-light'),
    atmospheric: () => window.tryBlendMode('multiply'),
    dreamy: () => window.tryBlendMode('lighten')
  };

  // ========================================
  // ACCESSIBILITY
  // ========================================

  function applyAriaLabelsFromText() {
    const zones = document.querySelectorAll('.zone');
    zones.forEach((zone) => {
      if (!zone.getAttribute('aria-label')) {
        const label = zone.querySelector('.zone-label');
        if (label && label.textContent.trim()) {
          zone.setAttribute('aria-label', label.textContent.trim());
        }
      }
      if (!zone.hasAttribute('tabindex')) {
        zone.setAttribute('tabindex', '0');
      }
    });
  }

  function setupBlendPanel() {
    const select = document.getElementById('blendSelect');
    const applyBtn = document.getElementById('blendApply');
    if (!select || !applyBtn) return;

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

  // ========================================
  // SVG SPRITE LOADER
  // ========================================

  async function fetchText(url) {
    try {
      const encoded = encodeURI(url);
      const res = await fetch(encoded);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.text();
    } catch (_err) {
      return null;
    }
  }

  function parseSvgToSymbol(svgText, symbolId) {
    if (!svgText) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.documentElement;
    if (!svgEl || svgEl.nodeName.toLowerCase() !== 'svg') return null;

    const viewBox = svgEl.getAttribute('viewBox') || undefined;

    const shapeTags = new Set(['path', 'polygon', 'polyline', 'rect', 'circle', 'ellipse']);

    function hideShapeVisuals(el) {
      const tag = el.nodeName && el.nodeName.toLowerCase();
      if (!tag || !shapeTags.has(tag)) return;
      const existing = el.getAttribute('style') || '';
      const needsSemi = existing && !existing.trim().endsWith(';');
      const append = (needsSemi ? existing + '; ' : existing) + 'stroke: none; stroke-opacity: 0; fill: transparent;';
      el.setAttribute('style', append);
      el.setAttribute('stroke', 'none');
      el.setAttribute('stroke-opacity', '0');
      el.setAttribute('fill', 'transparent');
    }

    function sanitizeSvgTree(root) {
      const stack = [root];
      while (stack.length) {
        const node = stack.pop();
        if (node.nodeType === 1) {
          hideShapeVisuals(node);
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child && child.nodeType === 1) stack.push(child);
          }
        }
      }
    }

    sanitizeSvgTree(svgEl);

    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', symbolId);
    if (viewBox) symbol.setAttribute('viewBox', viewBox);

    while (svgEl.firstChild) {
      symbol.appendChild(svgEl.firstChild);
    }
    return symbol;
  }

  async function injectZoneSprite() {
    if (spriteInjected) return;

    const files = [
      { id: 'headspace-starry-path', urls: ['good svg paths/headspace-starry-path'] },
      { id: 'atmosphere', urls: ['good svg paths/atmosphere'] },
      { id: 'mountain-peak', urls: ['good svg paths/mountain-peak'] },
      { id: 'foggy-cliff-top-fog', urls: ['good svg paths/foggy-cliff-top-fog'] },
      { id: 'foggy-cliff-cliff', urls: ['good svg paths/foggy-cliff-cliff'] },
      { id: 'foggy-cliff-bottom-fog', urls: ['good svg paths/foggy-cliff-bottom-fog'] },
    ];

    const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sprite.setAttribute('aria-hidden', 'true');
    sprite.setAttribute('focusable', 'false');
    sprite.style.position = 'absolute';
    sprite.style.width = '0';
    sprite.style.height = '0';
    sprite.style.overflow = 'hidden';

    let anyAdded = false;
    for (const file of files) {
      let text = null;
      for (const url of file.urls) {
        text = await fetchText(url);
        if (text) break;
      }
      const symbol = parseSvgToSymbol(text, file.id);
      if (symbol) {
        sprite.appendChild(symbol);
        anyAdded = true;
      } else {
        console.warn('Sprite missing:', file.urls.map(u => encodeURI(u)).join(' | '));
      }
    }

    if (anyAdded) {
      document.body.insertBefore(sprite, document.body.firstChild);
      spriteInjected = true;
      console.log('%c✅ Injected SVG sprite for zone shapes', 'color:#4fc3f7');
    } else {
      console.warn('No SVG symbols injected; check paths under "good svg paths".');
    }
  }

  // ========================================
  // WELCOME MODAL
  // ========================================

  function setupWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const dismissBtn = document.getElementById('welcomeDismiss');
    if (!modal || !dismissBtn) return;

    let storageAvailable = true;
    try {
      const testKey = '__welcome_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
    } catch (_storageErr) {
      storageAvailable = false;
    }

    const hasSeen = storageAvailable
      ? window.localStorage.getItem(WELCOME_STORAGE_KEY) === '1'
      : false;

    if (hasSeen) return;

    const markSeen = () => {
      if (!storageAvailable) return;
      try {
        window.localStorage.setItem(WELCOME_STORAGE_KEY, '1');
      } catch (_err) {
        // Ignore write issues (private mode, etc.)
      }
    };

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    const closeModal = () => {
      if (modal.hasAttribute('hidden')) return;
      modal.setAttribute('hidden', '');
      document.body.classList.remove('welcome-modal-open');
      dismissBtn.removeEventListener('click', handleDismiss);
      modal.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeydown, true);
      markSeen();
    };

    const handleDismiss = () => {
      closeModal();
    };

    const handleOutsideClick = (event) => {
      if (event.target === modal) {
        closeModal();
      }
    };

    dismissBtn.addEventListener('click', handleDismiss);
    modal.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown, true);

    modal.removeAttribute('hidden');
    document.body.classList.add('welcome-modal-open');

    setTimeout(() => {
      dismissBtn.focus({ preventScroll: true });
    }, 50);
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  function init() {
    setupSmoothScroll();
    setupExternalLinks();
    setupKeyboardShortcuts();
    applyAriaLabelsFromText();
    setupBlendPanel();
    injectZoneSprite();
    setupWelcomeModal();

    console.log('%c✨ Sol Eremus Interactive Scene', 'font-size: 16px; color: #4fc3f7; font-weight: bold');
    console.log('%c💡 Press D to toggle zone boundaries', 'color: #4fc3f7; font-size: 12px');
    console.log('%c💡 Press B for blend mode tester', 'color: #4fc3f7; font-size: 12px');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
