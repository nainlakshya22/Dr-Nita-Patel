/**
 * 3D INTERACTIVE ANATOMICAL SKIN SCIENCE EXPERIENCE
 * Powered by Three.js • Procedural Cellular Textures • Raycaster & Camera Focus
 * Advance Dermatology & Laser Medical Center — Dr. Nita Patel, MD
 */

(function () {
  'use strict';

  const Skin3D = {
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    rootGroup: null,
    layers: {},
    layerMaterials: {},
    raycastMeshes: [],
    activeLayer: 'all', // 'all' | 'epidermis' | 'dermis' | 'hypodermis'
    isDragging: false,
    pointerMoved: false,
    pointerDownPos: { x: 0, y: 0 },
    previousMousePosition: { x: 0, y: 0 },
    targetRotation: { x: 0.22, y: 0.55 },
    currentRotation: { x: 0.22, y: 0.55 },
    targetZoom: 5.4,
    currentZoom: 5.4,
    targetLookY: 0,
    currentLookY: 0,
    animFrameId: null,
    isVisible: true,
    observer: null,
    cleanupFns: [],
    hasReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const LAYER_DATA = {
    all: {
      badge: "Complete Cross-Section",
      name: "Full Cutaneous Architecture",
      depth: "0.05 mm – 10.0+ mm",
      cellularProfile: "A cohesive three-tier biological organ uniting the protective epidermal barrier, the collagen-rich dermal scaffold, and the insulating subcutaneous fascia.",
      clinicalRole: "Different laser wavelengths and injectables operate at distinct depths—from superficial melanin phototherapy in the epidermis to neocollagenesis in the deep dermis.",
      laserTarget: "Multi-depth calibrated wavelengths (420nm – 1064nm – 2940nm)",
      treatments: [
        { name: "Halo™ Dual-Depth Hybrid Laser", link: "#treatment/halo-laser" },
        { name: "BBL® HERO™ + RF Microneedling", link: "#treatment/bbl-hero" },
        { name: "Comprehensive Skin Cancer Screening", link: "#treatment/skin-cancer-screening" }
      ],
      camLookY: 0.0,
      camZoom: 5.5
    },
    epidermis: {
      badge: "01 • Surface Barrier",
      name: "Epidermis & Stratum Corneum",
      depth: "0.05 mm – 0.15 mm",
      cellularProfile: "Stratified squamous keratinocytes, basal melanocytes (pigment synthesis), Langerhans immune sentinels, and an acidic hydrolipid mantle undulating over dermal papillae.",
      clinicalRole: "Primary defensive shield against UV radiation, pathogens, and transepidermal water loss (TEWL). Cellular turnover completes every 28 to 40 days.",
      laserTarget: "Melanin chromophores, lentigines, actinic pigment",
      treatments: [
        { name: "Sciton BBL® HERO™ Photofacial", link: "#treatment/bbl-hero" },
        { name: "HydraFacial MD® Vortex Infusion", link: "#treatment/hydrafacial-md" },
        { name: "Clinical Acne & Barrier Care", link: "#treatment/acne-protocols" }
      ],
      camLookY: 0.85,
      camZoom: 4.5
    },
    dermis: {
      badge: "02 • Structural Matrix",
      name: "Papillary & Reticular Dermis",
      depth: "1.5 mm – 3.0 mm",
      cellularProfile: "Woven Type I & Type III collagen bundles, elastin micro-fibrils, hyaluronic acid ground substance, fibroblasts, and capillary arteriole-venule loops.",
      clinicalRole: "Provides tensile strength, bounce, and vascular nourishment. Fractional lasers create controlled microthermal columns here to stimulate vigorous neocollagenesis.",
      laserTarget: "Water & hemoglobin chromophores, fibroblasts, micro-capillaries",
      treatments: [
        { name: "Halo™ Hybrid Fractional Laser", link: "#treatment/halo-laser" },
        { name: "Clinical RF Microneedling", link: "#treatment/rf-microneedling" },
        { name: "Rosacea & Vascular Laser", link: "#treatment/rosacea-vascular" }
      ],
      camLookY: 0.0,
      camZoom: 4.5
    },
    hypodermis: {
      badge: "03 • Deep Foundation",
      name: "Hypodermis (Subcutaneous Fascia)",
      depth: "3.0 mm – 10.0+ mm",
      cellularProfile: "Clustered adipose lobules supported by fibrous connective septa, deep vascular supply plexuses, and sensory nerve branches.",
      clinicalRole: "Acts as thermal insulation, biomechanical cushion, and structural volume foundation anchoring skin to deeper facial musculature.",
      laserTarget: "Deep connective septa & structural volume planes",
      treatments: [
        { name: "HA Dermal Fillers & Balancing", link: "#treatment/dermal-fillers" },
        { name: "Botox® Neuromodulator Precision", link: "#treatment/botox-cosmetic" },
        { name: "Physician Facial Evaluation", link: "#about-doctor" }
      ],
      camLookY: -0.85,
      camZoom: 4.6
    }
  };

  // Procedural organic cellular texture generator (no external image overhead)
  function createCellularTexture(baseHex, accentHex, density) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < density; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = 4 + Math.random() * 14;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, accentHex);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // Create sculpted organic undulating box geometry (simulates dermal papillae ridges)
  function createOrganicSlabGeometry(width, height, depth, segX, segZ, topAmp, bottomAmp, freq) {
    const geo = new THREE.BoxGeometry(width, height, depth, segX, 4, segZ);
    const pos = geo.attributes.position;
    const halfH = height / 2;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      const waveTop = Math.sin(x * freq) * Math.cos(z * freq) * topAmp + Math.sin((x + z) * freq * 0.6) * (topAmp * 0.4);
      const waveBot = Math.sin(x * freq + 0.8) * Math.cos(z * freq + 0.5) * bottomAmp;

      const t = (y + halfH) / height; // 0 bottom -> 1 top
      const offset = waveBot * (1 - t) + waveTop * t;
      pos.setY(i, y + offset);
    }

    geo.computeVertexNormals();
    return geo;
  }

  window.disposeSkin3DExperience = function () {
    if (Skin3D.animFrameId) {
      cancelAnimationFrame(Skin3D.animFrameId);
      Skin3D.animFrameId = null;
    }
    if (Skin3D.observer) {
      Skin3D.observer.disconnect();
      Skin3D.observer = null;
    }
    Skin3D.cleanupFns.forEach(fn => { try { fn(); } catch (e) {} });
    Skin3D.cleanupFns = [];
    if (Skin3D.renderer) {
      Skin3D.renderer.dispose();
      Skin3D.renderer = null;
    }
    Skin3D.layers = {};
    Skin3D.layerMaterials = {};
    Skin3D.raycastMeshes = [];
  };

  function renderFallbackDiagram(container) {
    container.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:24px; gap:12px;">
        <div style="font-size:0.75rem; color:var(--gold-300); text-transform:uppercase; letter-spacing:0.08em;">Interactive Anatomical Fallback</div>
        <button type="button" onclick="window.select3DSkinLayer('epidermis')" style="width:100%; max-width:340px; padding:16px; border-radius:10px; background:rgba(250,240,228,0.16); border:1px solid #DFCDAE; color:#FFF; cursor:pointer; text-align:left;">
          <strong>01. Epidermis</strong> <span style="display:block; font-size:0.78rem; color:#CBD5E1;">0.05mm – 0.15mm • Melanin &amp; Barrier</span>
        </button>
        <button type="button" onclick="window.select3DSkinLayer('dermis')" style="width:100%; max-width:340px; padding:20px; border-radius:10px; background:rgba(232,199,184,0.18); border:1px solid #C5A880; color:#FFF; cursor:pointer; text-align:left;">
          <strong>02. Dermis</strong> <span style="display:block; font-size:0.78rem; color:#CBD5E1;">1.5mm – 3.0mm • Collagen &amp; Micro-Vessels</span>
        </button>
        <button type="button" onclick="window.select3DSkinLayer('hypodermis')" style="width:100%; max-width:340px; padding:18px; border-radius:10px; background:rgba(20,184,166,0.18); border:1px solid #14B8A6; color:#FFF; cursor:pointer; text-align:left;">
          <strong>03. Hypodermis</strong> <span style="display:block; font-size:0.78rem; color:#CBD5E1;">3.0mm – 10.0mm • Subcutaneous Fascia</span>
        </button>
      </div>
    `;
    window.select3DSkinLayer('all');
  }

  window.setSkin3DScrollOffset = function (progress) {
    Skin3D.scrollOffset = (progress - 0.5) * 1.1;
  };

  window.initSkin3DExperience = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!window.THREE) {
      renderFallbackDiagram(container);
      return;
    }

    window.disposeSkin3DExperience();
    Skin3D.container = container;
    Skin3D.container.innerHTML = '';

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    Skin3D.scene = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    Skin3D.currentZoom = 5.5;
    Skin3D.targetZoom = 5.5;
    Skin3D.currentLookY = 0;
    Skin3D.targetLookY = 0;
    Skin3D.scrollOffset = 0;
    Skin3D.currentRotation = { x: 0.24, y: 0.58 };
    Skin3D.targetRotation = { x: 0.24, y: 0.58 };
    camera.position.set(0, 1.2, Skin3D.currentZoom);
    camera.lookAt(0, 0, 0);
    Skin3D.camera = camera;

    // 2. Renderer with graceful WebGL fallback
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      renderFallbackDiagram(container);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.maxWidth = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    Skin3D.renderer = renderer;

    // 3. Soft Clinical Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFDF8, 0.78);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.05);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC5A880, 0.85);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const tealFill = new THREE.PointLight(0x14B8A6, 0.9, 12);
    tealFill.position.set(3, -3, 3);
    scene.add(tealFill);

    // Root Group for Orbit Rotation
    const rootGroup = new THREE.Group();
    rootGroup.rotation.set(Skin3D.currentRotation.x, Skin3D.currentRotation.y, 0);
    scene.add(rootGroup);
    Skin3D.rootGroup = rootGroup;

    const w = 2.55;
    const d = 2.55;

    // Textures
    const epiTex = createCellularTexture('#F7E8D8', 'rgba(197, 168, 128, 0.22)', 85);
    const dermTex = createCellularTexture('#E7C6B0', 'rgba(220, 130, 110, 0.18)', 70);

    // -----------------------------------------------------------------------
    // LAYER 1: EPIDERMIS (Undulating dermal-epidermal junction + follicle)
    // -----------------------------------------------------------------------
    const epiGroup = new THREE.Group();
    epiGroup.position.y = 0.78;
    const epiGeo = createOrganicSlabGeometry(w, 0.34, d, 28, 28, 0.035, 0.075, 4.2);
    const epiMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF0E4,
      map: epiTex,
      roughness: 0.28,
      metalness: 0.02,
      transmission: 0.35,
      thickness: 0.45,
      transparent: true,
      opacity: 0.94,
      clearcoat: 0.65,
      clearcoatRoughness: 0.25,
      emissive: new THREE.Color(0xC5A880),
      emissiveIntensity: 0.05
    });
    const epiMesh = new THREE.Mesh(epiGeo, epiMat);
    epiMesh.userData.layerKey = 'epidermis';
    epiGroup.add(epiMesh);
    Skin3D.raycastMeshes.push(epiMesh);

    // Basal melanocyte spheres nestled along the undulating junction
    const melanoGeo = new THREE.SphereGeometry(0.038, 10, 10);
    const melanoMat = new THREE.MeshStandardMaterial({ color: 0xB4834E, roughness: 0.4, transparent: true, opacity: 0.85 });
    for (let gx = -0.9; gx <= 0.9; gx += 0.45) {
      for (let gz = -0.9; gz <= 0.9; gz += 0.45) {
        const mel = new THREE.Mesh(melanoGeo, melanoMat);
        const waveY = Math.sin(gx * 4.2 + 0.8) * Math.cos(gz * 4.2 + 0.5) * 0.075;
        mel.position.set(gx, -0.15 + waveY, gz);
        epiGroup.add(mel);
      }
    }

    // Subtle Hair Follicle Shaft emerging through epidermis
    const hairCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, -0.25, 0.35),
      new THREE.Vector3(-0.4, 0.15, 0.32),
      new THREE.Vector3(-0.32, 0.55, 0.28)
    ]);
    const hairGeo = new THREE.TubeGeometry(hairCurve, 16, 0.02, 8, false);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.35, transparent: true, opacity: 0.85 });
    epiGroup.add(new THREE.Mesh(hairGeo, hairMat));

    rootGroup.add(epiGroup);
    Skin3D.layers.epidermis = epiGroup;
    Skin3D.layerMaterials.epidermis = [epiMat, melanoMat, hairMat];

    // -----------------------------------------------------------------------
    // LAYER 2: DERMIS (Undulating matrix + 3D Collagen Helices + Capillaries)
    // -----------------------------------------------------------------------
    const dermGroup = new THREE.Group();
    dermGroup.position.y = 0.0;
    const dermGeo = createOrganicSlabGeometry(w, 0.86, d, 28, 28, 0.075, 0.045, 4.2);
    const dermMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8C7B8,
      map: dermTex,
      roughness: 0.38,
      metalness: 0.02,
      transmission: 0.48,
      thickness: 0.75,
      transparent: true,
      opacity: 0.72,
      clearcoat: 0.35,
      emissive: new THREE.Color(0xC5A880),
      emissiveIntensity: 0.04
    });
    const dermMesh = new THREE.Mesh(dermGeo, dermMat);
    dermMesh.userData.layerKey = 'dermis';
    dermGroup.add(dermMesh);
    Skin3D.raycastMeshes.push(dermMesh);

    const dermExtras = [];

    // 3D Woven Collagen & Elastin Fibers inside Dermis
    const collagenMat = new THREE.MeshStandardMaterial({ color: 0xDFCDAE, roughness: 0.3, transparent: true, opacity: 0.85 });
    dermExtras.push(collagenMat);
    for (let c = -2; c <= 2; c++) {
      const pts = [];
      for (let s = 0; s <= 12; s++) {
        const px = -1.0 + (s / 12) * 2.0;
        const py = Math.sin(s * 0.9 + c) * 0.18;
        const pz = c * 0.38 + Math.cos(s * 0.8) * 0.14;
        pts.push(new THREE.Vector3(px, py, pz));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const fibMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.018, 6, false), collagenMat);
      fibMesh.userData.layerKey = 'dermis';
      dermGroup.add(fibMesh);
    }

    // Arteriole (crimson) & Venule (teal-blue) capillary plexus loops
    const artMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.35, transparent: true, opacity: 0.8 });
    const venMat = new THREE.MeshStandardMaterial({ color: 0x0D9488, roughness: 0.35, transparent: true, opacity: 0.8 });
    dermExtras.push(artMat, venMat);
    [-0.6, 0.35].forEach((zOff, idx) => {
      const vesselPts = [
        new THREE.Vector3(-1.05, -0.3, zOff),
        new THREE.Vector3(-0.35, 0.2, zOff + 0.12),
        new THREE.Vector3(0.45, 0.12, zOff - 0.1),
        new THREE.Vector3(1.05, -0.26, zOff)
      ];
      const vCurve = new THREE.CatmullRomCurve3(vesselPts);
      const vMesh = new THREE.Mesh(new THREE.TubeGeometry(vCurve, 22, 0.022, 7, false), idx === 0 ? artMat : venMat);
      vMesh.userData.layerKey = 'dermis';
      dermGroup.add(vMesh);
    });

    // Subtle Microthermal Laser Zones (visible highlight on Dermis focus)
    const mtzMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.35 });
    dermExtras.push(mtzMat);
    for (let ix = -0.7; ix <= 0.7; ix += 0.46) {
      for (let iz = -0.7; iz <= 0.7; iz += 0.46) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 0.65, 8), mtzMat);
        cyl.position.set(ix, 0.05, iz);
        dermGroup.add(cyl);
      }
    }

    rootGroup.add(dermGroup);
    Skin3D.layers.dermis = dermGroup;
    Skin3D.layerMaterials.dermis = [dermMat, ...dermExtras];

    // -----------------------------------------------------------------------
    // LAYER 3: HYPODERMIS (Fibrous Fascia + Organic Adipose Lobules)
    // -----------------------------------------------------------------------
    const hypoGroup = new THREE.Group();
    hypoGroup.position.y = -0.82;
    const hypoGeo = createOrganicSlabGeometry(w, 0.64, d, 24, 24, 0.045, 0.03, 3.8);
    const hypoMat = new THREE.MeshPhysicalMaterial({
      color: 0xCCE5E0,
      roughness: 0.42,
      metalness: 0.02,
      transmission: 0.55,
      thickness: 0.65,
      transparent: true,
      opacity: 0.68,
      emissive: new THREE.Color(0x14B8A6),
      emissiveIntensity: 0.04
    });
    const hypoMesh = new THREE.Mesh(hypoGeo, hypoMat);
    hypoMesh.userData.layerKey = 'hypodermis';
    hypoGroup.add(hypoMesh);
    Skin3D.raycastMeshes.push(hypoMesh);

    // Clustered Subcutaneous Adipose Lobules (organic varied spheres)
    const adipoMat = new THREE.MeshPhysicalMaterial({
      color: 0xFCD34D,
      roughness: 0.25,
      clearcoat: 0.6,
      transparent: true,
      opacity: 0.86
    });
    for (let ax = -0.88; ax <= 0.88; ax += 0.35) {
      for (let az = -0.88; az <= 0.88; az += 0.35) {
        const r = 0.11 + ((Math.abs(ax * az) * 7) % 0.05);
        const sp = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 14), adipoMat);
        sp.scale.set(1.15, 0.82, 1.1);
        sp.position.set(
          ax + Math.sin(az * 5) * 0.06,
          Math.cos(ax * 4 + az * 3) * 0.11,
          az + Math.cos(ax * 5) * 0.06
        );
        sp.userData.layerKey = 'hypodermis';
        hypoGroup.add(sp);
        Skin3D.raycastMeshes.push(sp);
      }
    }

    rootGroup.add(hypoGroup);
    Skin3D.layers.hypodermis = hypoGroup;
    Skin3D.layerMaterials.hypodermis = [hypoMat, adipoMat];

    // -----------------------------------------------------------------------
    // 4. INTERACTIVE CONTROLS: DRAG-TO-ROTATE, CLICK-TO-SELECT, ZOOM
    // -----------------------------------------------------------------------
    const domElem = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();

    function getClientXY(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function onPointerDown(e) {
      const pt = getClientXY(e);
      Skin3D.isDragging = true;
      Skin3D.pointerMoved = false;
      Skin3D.pointerDownPos = { x: pt.x, y: pt.y };
      Skin3D.previousMousePosition = { x: pt.x, y: pt.y };
    }

    function onPointerMove(e) {
      if (!Skin3D.isDragging) return;
      const pt = getClientXY(e);
      const dx = pt.x - Skin3D.previousMousePosition.x;
      const dy = pt.y - Skin3D.previousMousePosition.y;

      if (Math.hypot(pt.x - Skin3D.pointerDownPos.x, pt.y - Skin3D.pointerDownPos.y) > 5) {
        Skin3D.pointerMoved = true;
      }

      Skin3D.targetRotation.y += dx * 0.0075;
      Skin3D.targetRotation.x = Math.max(-0.55, Math.min(0.72, Skin3D.targetRotation.x + dy * 0.0055));
      Skin3D.previousMousePosition = { x: pt.x, y: pt.y };
    }

    function onPointerUp(e) {
      if (!Skin3D.isDragging) return;
      Skin3D.isDragging = false;

      // Click without drag -> Raycast select layer directly on 3D model
      if (!Skin3D.pointerMoved && e.type === 'mouseup') {
        const rect = domElem.getBoundingClientRect();
        pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(Skin3D.raycastMeshes, false);
        if (hits.length > 0 && hits[0].object.userData.layerKey) {
          window.select3DSkinLayer(hits[0].object.userData.layerKey);
        }
      }
    }

    function onWheel(e) {
      e.preventDefault();
      Skin3D.targetZoom = Math.max(3.6, Math.min(7.5, Skin3D.targetZoom + e.deltaY * 0.003));
    }

    domElem.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    function onResize() {
      if (!Skin3D.container || !Skin3D.camera || !Skin3D.renderer) return;
      Skin3D.renderer.domElement.style.width = '100%';
      const nw = Skin3D.container.clientWidth || 320;
      const nh = Skin3D.container.clientHeight || 320;
      Skin3D.camera.aspect = nw / nh;
      Skin3D.camera.updateProjectionMatrix();
      Skin3D.renderer.setSize(nw, nh);
      Skin3D.renderer.domElement.style.maxWidth = '100%';
    }
    window.addEventListener('resize', onResize);

    Skin3D.cleanupFns.push(() => {
      domElem.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElem.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    });

    // Pause WebGL render loop when off-screen for peak performance
    if ('IntersectionObserver' in window) {
      Skin3D.observer = new IntersectionObserver((entries) => {
        Skin3D.isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      Skin3D.observer.observe(container);
    }

    // 5. Render & Smooth Interpolation Loop
    function animate() {
      Skin3D.animFrameId = requestAnimationFrame(animate);
      if (!Skin3D.isVisible) return;

      if (!Skin3D.isDragging && !Skin3D.hasReducedMotion) {
        Skin3D.targetRotation.y += 0.0022;
      }

      // Smooth rotation, zoom, and camera target focus
      Skin3D.currentRotation.x += (Skin3D.targetRotation.x - Skin3D.currentRotation.x) * 0.1;
      Skin3D.currentRotation.y += (Skin3D.targetRotation.y - Skin3D.currentRotation.y) * 0.1;
      rootGroup.rotation.set(Skin3D.currentRotation.x, Skin3D.currentRotation.y, 0);

      Skin3D.currentZoom += (Skin3D.targetZoom - Skin3D.currentZoom) * 0.08;
      Skin3D.currentLookY += (Skin3D.targetLookY - Skin3D.currentLookY) * 0.08;
      const scrollCamX = Skin3D.scrollOffset || 0;
      camera.position.set(scrollCamX, 1.05 + Skin3D.currentLookY * 0.65, Skin3D.currentZoom);
      camera.lookAt(0, Skin3D.currentLookY, 0);

      updateLayerTransitions();
      renderer.render(scene, camera);
    }
    animate();

    // Start on Full Model view so user sees complete unified anatomy first
    window.select3DSkinLayer('all');
  };

  function updateLayerTransitions() {
    const active = Skin3D.activeLayer;

    // Target Y separations
    const targets = {
      all:        { epi: 0.78, derm: 0.0,  hypo: -0.82 },
      epidermis:  { epi: 1.15, derm: -0.1, hypo: -1.05 },
      dermis:     { epi: 1.15, derm: 0.0,  hypo: -1.15 },
      hypodermis: { epi: 1.05, derm: 0.1,  hypo: -1.15 }
    }[active];

    if (Skin3D.layers.epidermis) {
      Skin3D.layers.epidermis.position.y += (targets.epi - Skin3D.layers.epidermis.position.y) * 0.1;
    }
    if (Skin3D.layers.dermis) {
      Skin3D.layers.dermis.position.y += (targets.derm - Skin3D.layers.dermis.position.y) * 0.1;
    }
    if (Skin3D.layers.hypodermis) {
      Skin3D.layers.hypodermis.position.y += (targets.hypo - Skin3D.layers.hypodermis.position.y) * 0.1;
    }

    // Highlight active layer & softly dim inactive layers
    const baseOpacities = {
      epidermis: [0.94, 0.85, 0.85],
      dermis: [0.74, 0.85, 0.8, 0.8, 0.35],
      hypodermis: [0.70, 0.88]
    };

    ['epidermis', 'dermis', 'hypodermis'].forEach(key => {
      const mats = Skin3D.layerMaterials[key] || [];
      const isSelected = active === 'all' || active === key;
      mats.forEach((mat, idx) => {
        const fullOp = (baseOpacities[key] && baseOpacities[key][idx]) || 0.85;
        const targetOp = isSelected ? fullOp : fullOp * 0.24;
        mat.opacity += (targetOp - mat.opacity) * 0.12;
        if ('emissiveIntensity' in mat) {
          const targetEmissive = active === key ? 0.22 : 0.04;
          mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;
        }
      });
    });
  }

  window.zoomSkin3D = function (delta) {
    Skin3D.targetZoom = Math.max(3.6, Math.min(7.5, Skin3D.targetZoom + delta));
  };

  window.resetSkin3DView = function () {
    Skin3D.targetRotation = { x: 0.24, y: 0.58 };
    window.select3DSkinLayer('all');
  };

  window.select3DSkinLayer = function (layerKey) {
    if (!LAYER_DATA[layerKey]) return;
    Skin3D.activeLayer = layerKey;
    const data = LAYER_DATA[layerKey];

    // Smooth camera focus
    Skin3D.targetLookY = data.camLookY;
    Skin3D.targetZoom = data.camZoom;

    // Update control pills
    document.querySelectorAll('.skin-layer-btn').forEach(btn => {
      if (btn.getAttribute('data-layer') === layerKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update educational side panel
    const infoContainer = document.getElementById('skin-3d-info-card');
    if (infoContainer) {
      infoContainer.innerHTML = `
        <div style="animation: fadeIn 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px; flex-wrap: wrap;">
            <span class="badge badge-gold" style="font-size: 0.72rem;">${data.badge}</span>
            <span style="font-size: 0.8rem; color: #94A3B8; font-family: monospace;">Depth: ${data.depth}</span>
          </div>
          <h3 style="color: #FFF; font-size: 1.45rem; margin-bottom: 12px;">${data.name}</h3>
          
          <div style="margin-bottom: 14px;">
            <strong style="color: var(--gold-400); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Cellular Architecture:</strong>
            <p style="color: #CBD5E1; font-size: 0.875rem; line-height: 1.55;">${data.cellularProfile}</p>
          </div>

          <div style="margin-bottom: 14px;">
            <strong style="color: var(--teal-500); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Clinical Significance:</strong>
            <p style="color: #CBD5E1; font-size: 0.875rem; line-height: 1.55;">${data.clinicalRole}</p>
          </div>

          <div style="margin-bottom: 18px;">
            <strong style="color: #94A3B8; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Laser &amp; Clinical Targets:</strong>
            <span class="badge badge-navy" style="font-size: 0.75rem; color: #FFF; background: rgba(255,255,255,0.08); white-space: normal; text-align: left;">${data.laserTarget}</span>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <strong style="color: #FFF; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">Matched Clinic Protocols:</strong>
              ${layerKey !== 'all' ? `<button type="button" onclick="window.select3DSkinLayer('all')" style="background: none; border: none; color: var(--gold-400); font-size: 0.75rem; font-weight: 600; cursor: pointer;">View Full Model &crarr;</button>` : ''}
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${data.treatments.map(t => `
                <a href="${t.link}" class="btn btn-sm btn-secondary" style="justify-content: space-between; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); color: #FFF; font-size: 0.8rem;">
                  <span>${t.name}</span>
                  <span style="color: var(--gold-400);">&rarr;</span>
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  };

})();
