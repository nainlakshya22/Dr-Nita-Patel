/**
 * ADVANCED VISUAL EXPERIENCE & GSAP MOTION ENGINE
 * Cohesive Hero 3D Glass Composition • Scroll Storytelling • Varied 3D Cards • Magnetic CTAs
 * Advance Dermatology & Laser Medical Center — Dr. Nita Patel, MD
 */

(function () {
  'use strict';

  const VisualState = {
    mouse: { targetX: 0, targetY: 0, currentX: 0, currentY: 0 },
    scrollProgress: 0,
    hasReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    heroRenderer: null,
    heroAnimId: null,
    heroObserver: null,
    heroVisible: true,
    cleanupFns: [],
    cursorInitialized: false
  };

  window.disposeVisualUpgrades = function () {
    if (VisualState.heroAnimId) {
      cancelAnimationFrame(VisualState.heroAnimId);
      VisualState.heroAnimId = null;
    }
    if (VisualState.heroObserver) {
      VisualState.heroObserver.disconnect();
      VisualState.heroObserver = null;
    }
    VisualState.cleanupFns.forEach(fn => { try { fn(); } catch (e) {} });
    VisualState.cleanupFns = [];
    if (VisualState.heroRenderer) {
      VisualState.heroRenderer.dispose();
      VisualState.heroRenderer = null;
    }
    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  };

  // 1. COHESIVE HERO 3D GLASS & ORGANIC CELLULAR COMPOSITION
  function initHero3DCanvas() {
    const heroBg = document.getElementById('hero-3d-canvas-container');
    if (!heroBg || !window.THREE) return;

    heroBg.innerHTML = '';

    const width = heroBg.clientWidth || window.innerWidth;
    const height = heroBg.clientHeight || 720;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0B1521, 0.045);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.maxWidth = '100%';
    renderer.domElement.style.display = 'block';
    heroBg.appendChild(renderer.domElement);
    VisualState.heroRenderer = renderer;

    // Curated Medical Studio Lighting
    scene.add(new THREE.AmbientLight(0xFFFDF9, 0.55));

    const goldKey = new THREE.PointLight(0xDFCDAE, 2.2, 24);
    goldKey.position.set(5, 4, 5);
    scene.add(goldKey);

    const tealRim = new THREE.PointLight(0x14B8A6, 1.8, 22);
    tealRim.position.set(-5, -3, 4);
    scene.add(tealRim);

    const topSpot = new THREE.DirectionalLight(0xFFFFFF, 0.9);
    topSpot.position.set(0, 8, 6);
    scene.add(topSpot);

    // Master sculptural cluster positioned cleanly to frame right/center depth
    const sculpture = new THREE.Group();
    sculpture.position.set(width > 992 ? 2.4 : 0.4, 0.1, 0);
    scene.add(sculpture);

    // A. Concentric Frosted Glass Optical Rings (Laser Precision Motif)
    const glassRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8D8C3,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.78,
      thickness: 0.6,
      transparent: true,
      opacity: 0.65,
      clearcoat: 1.0
    });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.045, 24, 96), glassRingMat);
    outerRing.rotation.set(0.65, 0.4, 0.2);
    sculpture.add(outerRing);

    const tealGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x2DD4BF,
      roughness: 0.18,
      metalness: 0.05,
      transmission: 0.75,
      thickness: 0.5,
      transparent: true,
      opacity: 0.5,
      clearcoat: 0.9
    });

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.032, 20, 84), tealGlassMat);
    innerRing.rotation.set(-0.55, 0.75, 0.1);
    sculpture.add(innerRing);

    // B. Sculpted Organic Collagen Helix Ribbon (Smooth Curve Tube)
    const helixPts = [];
    for (let i = 0; i <= 48; i++) {
      const t = (i / 48) * Math.PI * 2.5 - Math.PI * 1.25;
      const rad = 1.35 + Math.sin(t * 2) * 0.25;
      helixPts.push(new THREE.Vector3(
        Math.cos(t) * rad,
        t * 0.75,
        Math.sin(t) * rad
      ));
    }
    const helixCurve = new THREE.CatmullRomCurve3(helixPts);
    const helixMesh = new THREE.Mesh(
      new THREE.TubeGeometry(helixCurve, 72, 0.055, 14, false),
      glassRingMat
    );
    sculpture.add(helixMesh);

    // C. Three Depth-Layered Translucent Organic Biospheres (NOT random circles)
    const orbConfigs = [
      { pos: [0.0, 0.15, 0.4], r: 0.68, color: 0xDFCDAE, op: 0.35 },
      { pos: [-1.45, 1.05, -0.8], r: 0.42, color: 0x14B8A6, op: 0.38 },
      { pos: [1.35, -1.15, 0.9], r: 0.34, color: 0xC5A880, op: 0.42 }
    ];
    const orbs = orbConfigs.map((cfg, idx) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(cfg.r, 32, 32),
        new THREE.MeshPhysicalMaterial({
          color: cfg.color,
          roughness: 0.12,
          metalness: 0.05,
          transmission: 0.82,
          thickness: 0.9,
          transparent: true,
          opacity: cfg.op,
          clearcoat: 1.0
        })
      );
      m.position.set(...cfg.pos);
      m.userData = { basePos: [...cfg.pos], phase: idx * 2.1 };
      sculpture.add(m);
      return m;
    });

    // D. Controlled Fine Ambient Lattice Particles (Subtle atmospheric depth)
    const particleCount = 48;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 14;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xDFCDAE,
      size: 0.055,
      transparent: true,
      opacity: 0.45
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Pause when Hero scrolls off-screen
    if ('IntersectionObserver' in window) {
      VisualState.heroObserver = new IntersectionObserver((entries) => {
        VisualState.heroVisible = entries[0].isIntersecting;
      }, { threshold: 0.02 });
      VisualState.heroObserver.observe(heroBg);
    }

    const clock = new THREE.Clock();

    function renderHero() {
      VisualState.heroAnimId = requestAnimationFrame(renderHero);
      if (!VisualState.heroVisible) return;

      const t = clock.getElapsedTime();

      // Smooth mouse parallax interpolation
      VisualState.mouse.currentX += (VisualState.mouse.targetX - VisualState.mouse.currentX) * 0.05;
      VisualState.mouse.currentY += (VisualState.mouse.targetY - VisualState.mouse.currentY) * 0.05;

      // Scroll-driven depth transformation
      const heroEl = document.querySelector('.hero-section');
      const scrollRatio = heroEl ? Math.min(1, Math.max(0, window.scrollY / (heroEl.offsetHeight || 700))) : 0;

      camera.position.x = VisualState.mouse.currentX * 0.85;
      camera.position.y = -VisualState.mouse.currentY * 0.65 - scrollRatio * 1.1;
      camera.position.z = 9.5 + scrollRatio * 2.2;
      camera.lookAt(0, 0, 0);

      if (!VisualState.hasReducedMotion) {
        outerRing.rotation.z = 0.2 + t * 0.08;
        outerRing.rotation.x = 0.65 + Math.sin(t * 0.25) * 0.08;
        innerRing.rotation.z = 0.1 - t * 0.11;
        innerRing.rotation.y = 0.75 + Math.cos(t * 0.22) * 0.1;
        helixMesh.rotation.y = t * 0.14;
        sculpture.rotation.y = VisualState.mouse.currentX * 0.22 + scrollRatio * 0.5;
        sculpture.rotation.x = VisualState.mouse.currentY * 0.14;

        orbs.forEach(orb => {
          const [bx, by, bz] = orb.userData.basePos;
          const ph = orb.userData.phase;
          orb.position.y = by + Math.sin(t * 0.8 + ph) * 0.16;
          orb.position.x = bx + Math.cos(t * 0.6 + ph) * 0.1;
        });

        particles.rotation.y = t * 0.015;
      }

      renderer.render(scene, camera);
    }
    renderHero();

    function onResize() {
      if (!heroBg || !camera || !renderer) return;
      const nw = heroBg.clientWidth || window.innerWidth;
      const nh = heroBg.clientHeight || 700;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      sculpture.position.x = nw > 992 ? 2.4 : 0.4;
    }
    window.addEventListener('resize', onResize);
    VisualState.cleanupFns.push(() => window.removeEventListener('resize', onResize));
  }

  // Global Mouse Parallax Tracker
  window.addEventListener('mousemove', (e) => {
    VisualState.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    VisualState.mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // 2. GSAP TIMELINES & SCROLL STORYTELLING
  window.initGsapAnimations = function () {
    if (!window.gsap || VisualState.hasReducedMotion) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // A. Hero Entrance Choreography
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const badge = heroContent.querySelector('.badge');
      const title = heroContent.querySelector('h1');
      const desc = heroContent.querySelector('.hero-desc');
      const actions = heroContent.querySelector('.hero-actions');
      const trustItems = heroContent.querySelectorAll('.trust-item');
      const visualFrame = document.querySelector('.hero-visual-frame');

      // On mobile/compact viewports, keep hero headline & CTAs immediately readable without hiding at opacity 0
      if (window.innerWidth <= 992) {
        [badge, title, desc, visualFrame].forEach(el => {
          if (el) gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' });
        });
        if (actions) gsap.set(actions.children, { opacity: 1, y: 0, clearProps: 'transform' });
        if (trustItems.length) gsap.set(trustItems, { opacity: 1, y: 0, clearProps: 'transform' });
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (badge) tl.fromTo(badge, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.45 });

        if (title) {
          // Word-by-word cinematic typography stagger while preserving inner gold-gradient span
          if (!title.dataset.splitDone) {
            title.dataset.splitDone = '1';
            const walkAndWrap = (node) => {
              if (node.nodeType === 3) {
                const words = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach(w => {
                  if (!w.trim()) {
                    frag.appendChild(document.createTextNode(w));
                  } else {
                    const span = document.createElement('span');
                    span.className = 'hero-word-token';
                    span.style.cssText = 'display:inline-block;';
                    span.textContent = w;
                    frag.appendChild(span);
                  }
                });
                node.parentNode.replaceChild(frag, node);
              } else if (node.nodeType === 1) {
                Array.from(node.childNodes).forEach(walkAndWrap);
              }
            };
            walkAndWrap(title);
          }
          const wordTokens = title.querySelectorAll('.hero-word-token');
          if (wordTokens.length) {
            tl.fromTo(wordTokens,
              { opacity: 0, y: 26 },
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 },
              '-=0.2'
            );
          }
        }

        if (desc) tl.fromTo(desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.4');
        if (actions) tl.fromTo(actions.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, '-=0.35');
        if (trustItems.length) tl.fromTo(trustItems, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, '-=0.3');
        if (visualFrame) {
          tl.fromTo(visualFrame,
            { opacity: 0, scale: 0.94, y: 28 },
            { opacity: 1, scale: 1, y: 0, duration: 0.85 },
            '-=0.65'
          );
        }
      }
    }

    // B. ScrollTrigger Section & Card Storytelling (Skip opacity-0 scroll hiding on mobile <= 992px for instant, lag-free reading)
    const isDesktopViewport = window.innerWidth > 992;
    if (window.ScrollTrigger && isDesktopViewport) {
      // Section headers
      document.querySelectorAll('.section-header').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          }
        );
      });

      // Staggered Service & Choice Cards
      document.querySelectorAll('.services-grid, .concern-card-grid').forEach(grid => {
        const items = grid.querySelectorAll('.service-card, .concern-choice-card');
        if (items.length) {
          gsap.fromTo(items,
            { opacity: 0, y: 26, rotateX: 3 },
            {
              opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: grid, start: 'top 90%', once: true }
            }
          );
        }
      });

      // Subtle Parallax on Clinic / Laser Suite Media
      document.querySelectorAll('.parallax-media').forEach(media => {
        gsap.fromTo(media,
          { y: 14 },
          {
            y: -14, ease: 'none',
            scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
          }
        );
      });

      // Doctor Profile Editorial Reveals (Per-element triggers so tall columns never stick invisible)
      document.querySelectorAll('.doctor-cinematic-section .hero-visual-card, .doctor-cinematic-section .quote-card-editorial, .doctor-cinematic-section .doctor-bio-para, .doctor-cinematic-section .timeline-milestone, .doctor-cinematic-section .doctor-cta-row').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true }
          }
        );
      });
      const lineFill = document.querySelector('.doctor-timeline-fill');
      if (lineFill) {
        gsap.fromTo(lineFill,
          { scaleY: 0 },
          {
            scaleY: 1, duration: 0.75, ease: 'power2.inOut',
            scrollTrigger: { trigger: lineFill, start: 'top 90%', once: true }
          }
        );
      }

      // Patient Journey Entrance
      const journeyGrid = document.querySelector('.journey-grid');
      if (journeyGrid) {
        gsap.fromTo(journeyGrid.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: journeyGrid, start: 'top 90%', once: true }
          }
        );
      }

      // Morphing Organic Mask Transition (Circular/Pill -> Architectural Frame)
      document.querySelectorAll('.morph-mask-frame').forEach(frame => {
        gsap.fromTo(frame,
          { clipPath: 'inset(7% 8% 7% 8% round 120px)', scale: 0.94 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 20px)', scale: 1, ease: 'power2.out',
            scrollTrigger: { trigger: frame, start: 'top 90%', end: 'top 42%', scrub: 0.5 }
          }
        );
      });
    }

    // Scroll-Driven 3D Skin World Camera Movement (works safely across desktop & mobile)
    if (window.ScrollTrigger) {
      const skin3DSection = document.getElementById('skin-3d-section');
      if (skin3DSection) {
        ScrollTrigger.create({
          trigger: skin3DSection,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (window.setSkin3DScrollOffset) {
              window.setSkin3DScrollOffset(self.progress);
            }
          }
        });
      }
    }
  };

  // 3. 3D TILT EFFECT ON CARDS (Desktop non-touch only)
  window.init3DTiltCards = function () {
    if (VisualState.isTouchDevice || VisualState.hasReducedMotion || window.innerWidth <= 992) return;

    const cards = document.querySelectorAll('.service-card, .hero-visual-card, .concern-choice-card');
    cards.forEach(card => {
      if (card.dataset.tiltBound === '1') return;
      card.dataset.tiltBound = '1';
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5.5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  };

  // 4. MAGNETIC BUTTONS
  window.initMagneticButtons = function () {
    if (VisualState.isTouchDevice || VisualState.hasReducedMotion || window.innerWidth <= 992) return;

    const buttons = document.querySelectorAll('.btn-gold, .btn-primary, .nita-widget-btn');
    buttons.forEach(btn => {
      if (btn.dataset.magBound === '1') return;
      btn.dataset.magBound = '1';

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
      });
    });
  };

  // 5. DELEGATED SUBTLE MEDICAL CUSTOM CURSOR FOLLOWER (Desktop >992px only, hidden until mouse moves)
  function initCustomCursor() {
    if (VisualState.isTouchDevice || VisualState.hasReducedMotion || VisualState.cursorInitialized || window.innerWidth <= 992) return;
    VisualState.cursorInitialized = true;

    const cursorDot = document.createElement('div');
    cursorDot.id = 'medical-cursor-dot';
    cursorDot.style.cssText = 'position:fixed;top:0;left:0;width:7px;height:7px;background:var(--gold-500);border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);opacity:0;transition:width 0.2s,height 0.2s,opacity 0.2s;';
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.id = 'medical-cursor-ring';
    cursorRing.style.cssText = 'position:fixed;top:0;left:0;width:30px;height:30px;border:1px solid rgba(197,168,128,0.5);border-radius:50%;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);opacity:0;transition:width 0.2s,height 0.2s,border-color 0.2s,background 0.2s,opacity 0.2s;';
    document.body.appendChild(cursorRing);

    let ringX = -100, ringY = -100, dotX = -100, dotY = -100;

    window.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 992) {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
        return;
      }
      dotX = e.clientX;
      dotY = e.clientY;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
    }, { passive: true });

    function renderCursor() {
      ringX += (dotX - ringX) * 0.18;
      ringY += (dotY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Event delegation works across dynamic SPA route renders!
    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest('a, button, input, select, textarea, .service-card, .concern-choice-card, .journey-step-card, .tech-hotspot')) {
        cursorRing.style.width = '44px';
        cursorRing.style.height = '44px';
        cursorRing.style.borderColor = 'var(--gold-500)';
        cursorRing.style.background = 'rgba(197, 168, 128, 0.08)';
      } else {
        cursorRing.style.width = '30px';
        cursorRing.style.height = '30px';
        cursorRing.style.borderColor = 'rgba(197, 168, 128, 0.5)';
        cursorRing.style.background = 'transparent';
      }
    }, { passive: true });
  }

  // 6. FLOATING NAVIGATION HEADER & SMART DOCK CONTROLLER
  let navControllerBound = false;
  function initFloatingNavigationController() {
    if (navControllerBound) return;
    navControllerBound = true;

    function syncFloatingNav() {
      const header = document.querySelector('.site-header');
      const dock = document.getElementById('smart-dock');
      const footer = document.querySelector('.site-footer');
      const hash = window.location.hash || '#home';

      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }

      if (dock) {
        const isAdmin = hash.startsWith('#admin');
        dock.classList.toggle('hidden-route', isAdmin);

        let nearFooter = false;
        if (footer) {
          const rect = footer.getBoundingClientRect();
          nearFooter = rect.top < window.innerHeight - 40;
        }

        const shouldShow = !isAdmin && !nearFooter && (window.scrollY > 260 || hash !== '#home');
        dock.classList.toggle('visible', shouldShow);

        // Highlight active dock pill
        dock.querySelectorAll('.smart-dock-item').forEach(item => {
          const key = item.getAttribute('data-dock');
          const active = (key === 'home' && (hash === '#home' || hash === ''))
            || (key === 'services' && (hash.includes('services') || hash.includes('dermatology') || hash.includes('laser') || hash.includes('rejuvenation') || hash.includes('treatment')))
            || (key === 'booking' && hash.startsWith('#booking'));
          item.classList.toggle('active', active);
        });
      }
    }

    window.addEventListener('scroll', syncFloatingNav, { passive: true });
    window.addEventListener('hashchange', () => setTimeout(syncFloatingNav, 40));
    syncFloatingNav();
  }

  // 7. MASTER INITIALIZER
  window.applyVisualUpgrades = function () {
    window.disposeVisualUpgrades();
    initHero3DCanvas();
    window.initGsapAnimations();
    window.init3DTiltCards();
    window.initMagneticButtons();
    initFloatingNavigationController();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCustomCursor();
      window.applyVisualUpgrades();
    });
  } else {
    initCustomCursor();
    window.applyVisualUpgrades();
  }

})();
