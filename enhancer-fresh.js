// Sol Eremus - Beautiful Interactive Scene Enhancement
// Stars twinkle, mountains glow, fog swirls, the world comes alive

(function() {
  'use strict';

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  let debugMode = false;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let isHoveringPeak = false;
  let isHoveringFog = false;
  let spriteInjected = false;
  let starsInitialized = false;

  // ========================================
  // STAR SYSTEM - Individual twinkling stars
  // ========================================

  function createStars() {
    const skyZone = document.querySelector('.zone-sky');
    const effectStars = document.querySelector('.effect-stars');

    if (!skyZone || !effectStars) return;

    // Density scales a bit with viewport area but caps hard for perf
    const viewportArea = window.innerWidth * window.innerHeight;
    const starCount = Math.min(80, Math.max(30, Math.floor(viewportArea / 25000)));

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      // Random position across the sky
      const x = Math.random() * 100;
      const y = Math.random() * 60; // Stars mostly in upper portion

      // Random size (1-4px diameter)
      const size = Math.random() * 3 + 1;

      // Randomize twinkling duration (2-6 seconds)
      const duration = Math.random() * 4 + 2;

      // Randomize delay (0-3 seconds offset)
      const delay = Math.random() * 3;

      star.style.left = x + '%';
      star.style.top = y + '%';
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.setProperty('--duration', duration + 's');
      star.style.setProperty('--delay', delay + 's');

      effectStars.appendChild(star);
    }
  }

  // ========================================
  // SHOOTING STAR SYSTEM
  // ========================================

  function launchShootingStar() {
    const effectStars = document.querySelector('.effect-stars');
    if (!effectStars) return;

    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';

    // Random starting position in upper portion of sky
    const startX = Math.random() * 80 + 10;
    const startY = Math.random() * 40 + 5;

    shootingStar.style.left = startX + '%';
    shootingStar.style.top = startY + '%';

    effectStars.appendChild(shootingStar);

    // Remove after animation completes
    setTimeout(() => {
      shootingStar.remove();
    }, 2000);
  }

  // Occasionally launch shooting stars when hovering sky
  let shootingStarInterval = null;

  function startShootingStars() {
    if (shootingStarInterval) return; // Already running

    // Launch first one immediately
    launchShootingStar();

    // Then one every 3-5 seconds
    shootingStarInterval = setInterval(() => {
      launchShootingStar();
    }, Math.random() * 2000 + 3000);
  }

  function stopShootingStars() {
    if (shootingStarInterval) {
      clearInterval(shootingStarInterval);
      shootingStarInterval = null;
    }
  }

  // ========================================
  // MOUNTAIN GLOW TRACKING
  // ========================================

  function updateMountainGlow() {
    const peakZone = document.querySelector('.zone-peak');
    if (!peakZone || !isHoveringPeak) return;

    const rect = peakZone.getBoundingClientRect();
    const peakCenterX = rect.left + rect.width / 2;
    const peakCenterY = rect.top + rect.height * 0.3; // Peak is upper portion

    // Calculate distance from mouse to peak center
    const dx = mouseX - peakCenterX;
    const dy = mouseY - peakCenterY;

    // Position glow towards the mouse (light source is the viewer)
    const glowX = peakCenterX + dx * 0.3; // Dampen the effect
    const glowY = peakCenterY + dy * 0.3;

    // Convert to percentages relative to zone
    const relX = ((glowX - rect.left) / rect.width) * 100;
    const relY = ((glowY - rect.top) / rect.height) * 100;

    const effectGlow = peakZone.querySelector('.effect-glow');
    if (effectGlow) {
      effectGlow.style.setProperty('--glow-x', relX + '%');
      effectGlow.style.setProperty('--glow-y', relY + '%');
    }
  }

  // ========================================
  // FOG PARALLAX LAYERS
  // ========================================

  function updateFogParallax() {
    const fogZone = document.querySelector('.zone-fog');
    if (!fogZone || !isHoveringFog) return;

    const rect = fogZone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate offset from center (normalized -1 to 1)
    const offsetX = (mouseX - centerX) / (rect.width / 2);
    const offsetY = (mouseY - centerY) / (rect.height / 2);

    // Apply different parallax speeds to each layer
    const backDist = 20;     // Back layer: moves 20px max
    const midDist = 40;      // Mid layer: moves 40px max
    const frontDist = 60;    // Front layer: moves 60px max

    // Update CSS variables for fog layers
    fogZone.style.setProperty('--fog-back-x', (offsetX * backDist) + 'px');
    fogZone.style.setProperty('--fog-back-y', (offsetY * backDist) + 'px');

    fogZone.style.setProperty('--fog-mid-x', (offsetX * midDist) + 'px');
    fogZone.style.setProperty('--fog-mid-y', (offsetY * midDist) + 'px');

    // Front layer (if it exists as separate element)
    const frontLayer = fogZone.querySelector('.fog-layer-front');
    if (frontLayer) {
      frontLayer.style.setProperty('--fog-front-x', (offsetX * frontDist) + 'px');
      frontLayer.style.setProperty('--fog-front-y', (offsetY * frontDist) + 'px');
    }
  }

  // ========================================
  // MOUSE TRACKING
  // ========================================

  function setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update effects on next frame for performance
      requestAnimationFrame(() => {
        updateMountainGlow();
        updateFogParallax();
      });
    });

    // Track when hovering specific zones
    const peakZone = document.querySelector('.zone-peak');
    const fogZone = document.querySelector('.zone-fog');

    if (peakZone) {
      peakZone.addEventListener('mouseenter', () => { isHoveringPeak = true; });
      peakZone.addEventListener('mouseleave', () => { isHoveringPeak = false; });
    }

    if (fogZone) {
      fogZone.addEventListener('mouseenter', () => { isHoveringFog = true; });
      fogZone.addEventListener('mouseleave', () => { isHoveringFog = false; });
    }
  }

  // ========================================
  // SKY ZONE INTERACTIVITY
  // ========================================

  function setupSkyZoneInteractivity() {
    const skyZone = document.querySelector('.zone-sky');
    if (!skyZone) return;

    skyZone.addEventListener('mouseenter', () => {
      // Lazy init stars on first hover
      if (!starsInitialized) {
        createStars();
        starsInitialized = true;
      }

      // Resume twinkle
      const effectStars = document.querySelector('.effect-stars');
      if (effectStars) {
        effectStars.querySelectorAll('.star').forEach(s => {
          s.style.animationPlayState = 'running';
        });
      }

      startShootingStars();
    });

    skyZone.addEventListener('mouseleave', () => {
      stopShootingStars();

      // Pause twinkle
      const effectStars = document.querySelector('.effect-stars');
      if (effectStars) {
        effectStars.querySelectorAll('.star').forEach(s => {
          s.style.animationPlayState = 'paused';
        });
      }
    });
  }

  // ========================================
  // EXISTING FEATURES (from original)
  // ========================================

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

  // ========================================
  // SVG SPRITE LOADER (Good SVG Paths)
  // ========================================

  async function fetchText(url) {
    try {
      const encoded = encodeURI(url);
      const res = await fetch(encoded);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.text();
    } catch (_err) {
      return null; // Defer warning until all candidates fail
    }
  }

  function parseSvgToSymbol(svgText, symbolId) {
    if (!svgText) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.documentElement;
    if (!svgEl || svgEl.nodeName.toLowerCase() !== 'svg') return null;

    const viewBox = svgEl.getAttribute('viewBox') || undefined;

    // Ensure injected shapes are invisible (no hard outlines) while remaining interactive.
    // We aggressively neutralize stroke/fill on geometry elements because some source SVGs
    // include inline styles/presentation attributes that override external CSS.
    const shapeTags = new Set(['path', 'polygon', 'polyline', 'rect', 'circle', 'ellipse']);

    function hideShapeVisuals(el) {
      const tag = el.nodeName && el.nodeName.toLowerCase();
      if (!tag || !shapeTags.has(tag)) return;
      // Apply via style to override presentation attrs and existing inline styles
      const existing = el.getAttribute('style') || '';
      const needsSemi = existing && !existing.trim().endsWith(';');
      const append = (needsSemi ? existing + '; ' : existing) + 'stroke: none; stroke-opacity: 0; fill: transparent;';
      el.setAttribute('style', append);
      // Also set attributes for good measure (in case style is stripped elsewhere)
      el.setAttribute('stroke', 'none');
      el.setAttribute('stroke-opacity', '0');
      el.setAttribute('fill', 'transparent');
    }

    function sanitizeSvgTree(root) {
      const stack = [root];
      while (stack.length) {
        const node = stack.pop();
        if (node.nodeType === 1) { // ELEMENT_NODE
          hideShapeVisuals(node);
          // Continue traversal
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child && child.nodeType === 1) stack.push(child);
          }
        }
      }
    }

    // Sanitize before moving children into the symbol
    sanitizeSvgTree(svgEl);

    // Create a wrapper <symbol> and import all children
    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', symbolId);
    if (viewBox) symbol.setAttribute('viewBox', viewBox);

    // Move child nodes from parsed svg into symbol
    while (svgEl.firstChild) {
      symbol.appendChild(svgEl.firstChild);
    }
    return symbol;
  }

  async function injectZoneSprite() {
    if (spriteInjected) return;

    // Attempt multiple filename variants to be robust (.svg or no extension)
    const files = [
      // Use only non-extension paths to avoid 404 noise in dev (space in folder name is encoded)
      { id: 'headspace-starry-path', urls: ['good svg paths/headspace-starry-path'] },
      { id: 'atmosphere', urls: ['good svg paths/atmosphere'] },
      { id: 'mountain-peak', urls: ['good svg paths/mountain-peak'] },
      // Scene 2: Cliff shapes
      { id: 'foggy-cliff-top-fog', urls: ['good svg paths/foggy-cliff-top-fog'] },
      { id: 'foggy-cliff-cliff', urls: ['good svg paths/foggy-cliff-cliff'] },
      { id: 'foggy-cliff-bottom-fog', urls: ['good svg paths/foggy-cliff-bottom-fog'] },
    ];

    // Create hidden sprite container
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
  // INITIALIZATION
  // ========================================

  // Constrain CSS-based effects to SVG path shapes using foreignObject + clipPath
  function confineEffectsToPaths() {
    const zones = document.querySelectorAll('.zone');
    zones.forEach((zone, index) => {
      const zoneSvg = zone.querySelector('.zone-svg');
      const useEl = zoneSvg ? zoneSvg.querySelector('use') : null;
      const effectDiv = zone.querySelector('.zone-effect');
      if (!zoneSvg || !useEl || !effectDiv) return;

      const viewBox = zoneSvg.getAttribute('viewBox') || '0 0 1536 1024';
      const preserve = zoneSvg.getAttribute('preserveAspectRatio') || 'xMidYMid slice';
      const href = useEl.getAttribute('href') || useEl.getAttribute('xlink:href');
      if (!href) return;

      const clipId = `zone-clip-${index}`;

      // Build effect SVG overlay
      const svgNS = 'http://www.w3.org/2000/svg';
      const xhtmlNS = 'http://www.w3.org/1999/xhtml';

      const effectSvg = document.createElementNS(svgNS, 'svg');
      effectSvg.classList.add('zone-effect-svg');
      effectSvg.setAttribute('viewBox', viewBox);
      effectSvg.setAttribute('preserveAspectRatio', preserve);

      const defs = document.createElementNS(svgNS, 'defs');
      const clip = document.createElementNS(svgNS, 'clipPath');
      clip.setAttribute('id', clipId);
      const clipUse = document.createElementNS(svgNS, 'use');
      clipUse.setAttribute('href', href);
      clip.appendChild(clipUse);
      defs.appendChild(clip);

      const fo = document.createElementNS(svgNS, 'foreignObject');
      fo.setAttribute('x', '0');
      fo.setAttribute('y', '0');
      fo.setAttribute('width', '100%');
      fo.setAttribute('height', '100%');
      fo.setAttribute('clip-path', `url(#${clipId})`);

      const container = document.createElementNS(xhtmlNS, 'div');
      container.setAttribute('class', 'zone-effect-html');

      // Move all children of effectDiv into container
      while (effectDiv.firstChild) {
        container.appendChild(effectDiv.firstChild);
      }

      fo.appendChild(container);
      effectSvg.appendChild(defs);
      effectSvg.appendChild(fo);

      // Insert overlay and remove old effectDiv
      zone.appendChild(effectSvg);
      effectDiv.remove();
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
      setupMouseTracking();
      setupSkyZoneInteractivity();
      injectZoneSprite();
      confineEffectsToPaths();

      // If reduced motion, keep animations paused
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const effectStars = document.querySelector('.effect-stars');
        if (effectStars) {
          effectStars.querySelectorAll('.star').forEach(s => {
            s.style.animation = 'none';
          });
        }
      }

      console.log('%c✨ Sol Eremus Interactive Scene', 'font-size: 16px; color: #4fc3f7; font-weight: bold');
      console.log('%c💫 Stars twinkling | Shooting stars on sky hover', 'color: #4fc3f7; font-size: 12px');
      console.log('%c⛰️ Mountain glows to your pointer | Fog layers swirl', 'color: #4fc3f7; font-size: 12px');
      console.log('%c', '');
      console.log('%c💡 Press D to toggle zone boundaries', 'color: #4fc3f7; font-size: 12px');
      console.log('%c💡 Press B for blend mode tester', 'color: #4fc3f7; font-size: 12px');
      console.log('%c💡 Try: blendPresets.glowing()', 'color: #4fc3f7; font-size: 12px');
    });
  } else {
    setupSmoothScroll();
    setupExternalLinks();
    setupKeyboardShortcuts();
    applyAriaLabelsFromText();
    setupBlendPanel();
    setupMouseTracking();
    setupSkyZoneInteractivity();
    injectZoneSprite();
    confineEffectsToPaths();

    console.log('%c✨ Sol Eremus Interactive Scene', 'font-size: 16px; color: #4fc3f7; font-weight: bold');
    console.log('%c💫 Stars twinkling | Shooting stars on sky hover', 'color: #4fc3f7; font-size: 12px');
    console.log('%c⛰️ Mountain glows to your pointer | Fog layers swirl', 'color: #4fc3f7; font-size: 12px');
  }

})();
