/**
 * ADVANCE DERMATOLOGY & LASER MEDICAL CENTER
 * CLINICAL DATA STORE & PRACTICE INFORMATION
 * Dr. Nita Patel, MD — Board-Certified Dermatologist
 * Marina del Rey, California
 */

window.CLINIC_DATA = {
  brand: {
    name: "Dr. Nita Patel — Advance Dermatology & Laser Medical Center",
    shortName: "Advance Dermatology",
    tagline: "Excellence in Medical, Surgical & Aesthetic Dermatology",
    doctor: "Dr. Nita Patel, MD",
    doctorRole: "Board-Certified Dermatologist & Medical Director",
    location: "4640 Admiralty Way, Suite 500, Marina del Rey, CA 90292",
    city: "Marina del Rey",
    region: "Southern California",
    phone: "(310) 822-1200",
    demoPhone: "(310) 822-1200",
    email: "concierge@drpatellaser.com",
    hours: "Monday – Friday: 8:30 AM – 5:30 PM | Saturday: By Appointment Only",
    referenceWebsite: "https://www.drpatellaser.com/"
  },

  departments: [
    { id: "medical", name: "Medical Dermatology", badge: "Clinical Excellence", icon: "shield-alert", desc: "Expert diagnosis and compassionate management of complex skin conditions, skin cancers, and chronic dermatoses." },
    { id: "cosmetic", name: "Cosmetic Dermatology", badge: "Subtle Artistry", icon: "sparkles", desc: "Refined non-surgical aesthetic enhancements designed to preserve your natural facial balance and vitality." },
    { id: "lasers", name: "Laser & Light Therapies", badge: "Gold-Standard Tech", icon: "zap", desc: "State-of-the-art dual-wavelength laser resurfacing and photorejuvenation engineered for precision." },
    { id: "rejuvenation", name: "Skin Rejuvenation", badge: "Cellular Vitality", icon: "droplets", desc: "Advanced regenerative therapies, autologous growth factors, and restorative medical facials." }
  ],

  treatments: [
    {
      id: "skin-cancer-screening",
      dept: "medical",
      title: "Comprehensive Skin Cancer Screening & Dermoscopy",
      headline: "Early detection with high-resolution digital dermoscopic mole mapping",
      desc: "A meticulous head-to-toe clinical skin examination utilizing advanced polarized dermoscopy to detect precancerous lesions, basal cell carcinoma, squamous cell carcinoma, and early melanoma.",
      benefits: ["High-magnification dermoscopic analysis", "Minimally invasive diagnostic biopsy if indicated", "Personalized risk evaluation and UV surveillance plan", "Calm, supportive and thorough clinical review"],
      downtime: "None (Mild tenderness only if diagnostic biopsy performed)",
      duration: "30 – 45 Minutes",
      candidacy: "Recommended annually for all adults; biannually for patients with family history, dysplastic nevi, or high sun exposure.",
      sessions: "Annual baseline routine check or biannual high-risk monitoring",
      anesthesia: "None / Local for biopsies",
      costEstimate: "Covered by most PPO insurances (Subject to plan copay/deductible)",
      verificationStatus: "VERIFIED"
    },
    {
      id: "acne-protocols",
      dept: "medical",
      title: "Clinical Acne & Cystic Acne Protocols",
      headline: "Multi-modal medical protocols addressing acne at its biological root",
      desc: "Tailored clinical acne solutions combining topical retinoids, systemic antibiotics, hormonal regulators, clarifying medical extractions, and light-based therapies to clear active lesions and prevent scarring.",
      benefits: ["Individualized hormonal and microbiome assessment", "Cystic acne cortisone injections for rapid relief", "Reduction in post-inflammatory erythema and hyperpigmentation", "Structured home medical regimen formulation"],
      downtime: "None to mild redness for 24 hours",
      duration: "30 Minutes",
      candidacy: "Teens and adults struggling with persistent comedonal, inflammatory, or cystic acne.",
      sessions: "Initial 3-month stabilization protocol with monthly assessments",
      anesthesia: "None",
      costEstimate: "Medical consultation + prescription coverage via insurance",
      verificationStatus: "VERIFIED"
    },
    {
      id: "rosacea-vascular",
      dept: "medical",
      title: "Rosacea & Facial Vascular Management",
      headline: "Targeted clinical therapy for erythema, flushing, and sensitive skin",
      desc: "Specialized dermatological protocols designed to reduce facial redness, visible spider veins, and acne-like papules associated with erythematotelangiectatic and papulopustular rosacea.",
      benefits: ["Gentle barrier-repair medical topicals", "Vascular laser targeting broken micro-capillaries", "Trigger identification and lifestyle mitigation", "Immediate reduction in stinging and burning sensation"],
      downtime: "1 – 2 days of mild flushing",
      duration: "30 – 45 Minutes",
      candidacy: "Individuals experiencing chronic facial flushing, persistent redness on cheeks and nose, or ocular rosacea.",
      sessions: "3 – 5 sessions spaced 4 weeks apart for optimal vascular clearance",
      anesthesia: "Topical chilling or cooling gel",
      costEstimate: "Consultation medical; laser therapies elective",
      verificationStatus: "VERIFIED"
    },
    {
      id: "eczema-psoriasis",
      dept: "medical",
      title: "Eczema, Atopic Dermatitis & Psoriasis",
      headline: "Advanced biologic therapies and barrier restoration",
      desc: "Comprehensive diagnostic workup and contemporary management for chronic inflammatory dermatoses, including targeted biologic infusions, topical PDE4 inhibitors, and intensive barrier lipid restoration.",
      benefits: ["Access to modern targeted biologic therapies", "Non-steroidal topical anti-inflammatory solutions", "Patch testing for contact allergen identification", "Restoration of the skin's epidermal moisture barrier"],
      downtime: "None",
      duration: "30 – 45 Minutes",
      candidacy: "Patients suffering from itchy, dry, cracked, or scaling plaques unresponsive to basic moisturizers.",
      sessions: "Ongoing clinical management and periodic monitoring",
      anesthesia: "None",
      costEstimate: "Covered by most PPO insurance plans",
      verificationStatus: "VERIFIED"
    },
    {
      id: "halo-laser",
      dept: "lasers",
      title: "Halo™ Hybrid Fractional Laser Resurfacing",
      headline: "Dual-wavelength fractional photothermolysis for profound rejuvenation",
      desc: "The world's premier hybrid fractional laser combining non-ablative (1470nm) and ablative (2940nm) wavelengths to treat sun damage, enlarged pores, irregular texture, and fine lines with customizable downtime.",
      benefits: ["Simultaneous deep dermal collagen remodeling and epidermal renewal", "Noticeable improvement in skin luminosity and elasticity", "Significantly shorter downtime than traditional fully-ablative lasers", "Long-lasting neogenesis of Type I and Type III collagen"],
      downtime: "3 – 5 days of mild bronzing and MENDs (microscopic epidermal necrotic debris)",
      duration: "60 – 90 Minutes (Including topical numbing)",
      candidacy: "Ideal for patients seeking significant correction of sun damage, texture, and laxity without two weeks of recovery.",
      sessions: "1 – 2 sessions produce dramatic results; maintain annually",
      anesthesia: "Topical prescription lidocaine + integrated Zimmer cryogenic cooling",
      costEstimate: "Physician Evaluation & Personalized Laser Protocol",
      verificationStatus: "CLINIC_APPROVED"
    },
    {
      id: "bbl-hero",
      dept: "lasers",
      title: "BBL® HERO™ BroadBand Light Photofacial",
      headline: "High-energy rapid phototherapy for pigments, sun spots, and redness",
      desc: "Sciton BBL HERO delivers pulsed light energy with 4x the speed and 3x the peak power of legacy IPL, targeting melanin clusters and hemoglobin to restore clear, radiant, youthful skin.",
      benefits: ["Rapid clearance of brown age spots and stubborn sun freckles", "Diffuse redness and broken capillary reduction", "Gentle, non-invasive with zero peeling or crusting", "Clinically documented gene expression rejuvenation"],
      downtime: "0 – 1 day (Pigments darken like coffee grounds before flaking off in 4-7 days)",
      duration: "30 – 45 Minutes",
      candidacy: "Patients with sun damage on face, neck, chest, arms, or hands.",
      sessions: "Series of 3 – 4 treatments for complete clearance; maintenance biannually",
      anesthesia: "Sapphire cooling plate contact (No numbing required)",
      costEstimate: "Clinical Skin Assessment & Phototherapy Protocol",
      verificationStatus: "CLINIC_APPROVED"
    },
    {
      id: "gentlemax-pro",
      dept: "lasers",
      title: "GentleMax Pro® Dual-Wavelength Laser Hair Removal",
      headline: "Medical-grade permanent hair reduction safe for all Fitzpatrick skin types",
      desc: "Combining the 755nm Alexandrite laser for lighter skin tones with the 1064nm Nd:YAG laser for deeper and tanned skin tones, ensuring safe, effective, and permanent follicle disablement.",
      benefits: ["Safe and validated on Fitzpatrick skin types I through VI", "Integrated Dynamic Cooling Device (DCD) for maximum comfort", "Significant reduction in painful ingrown hairs and folliculitis", "High-speed large spot sizes for rapid back, chest, and leg sessions"],
      downtime: "None (Transient erythema resolves within 2 – 4 hours)",
      duration: "15 – 60 Minutes (Depending on area)",
      candidacy: "Men and women with unwanted pigmented facial or body hair.",
      sessions: "6 – 8 sessions spaced 4 to 8 weeks apart",
      anesthesia: "Dynamic Cryogen spray cooling with each pulse",
      costEstimate: "Complimentary Fitzpatrick Consultation & Treatment Series",
      verificationStatus: "CLINIC_APPROVED"
    },
    {
      id: "botox-cosmetic",
      dept: "cosmetic",
      title: "Botox® Cosmetic & Dysport® Neuromodulators",
      headline: "Physician-administered precision micro-dosing for natural expression",
      desc: "Expertly placed micro-injections targeting hyperactive facial mimetic muscles to soften frown lines (glabella), crow's feet, and horizontal forehead furrows while preserving natural facial mobility.",
      benefits: ["Administered directly with anatomical mastery", "Prevents static wrinkle etching in high-movement zones", "No 'frozen' or unnatural appearance; elegant softening", "Quick 15-minute lunchtime procedure with immediate return to work"],
      downtime: "None (Avoid strenuous exercise and lying flat for 4 hours)",
      duration: "15 – 20 Minutes",
      candidacy: "Adults seeking to soften dynamic expression lines or prevent premature wrinkle deepening.",
      sessions: "Repeated every 3 to 4 months for continuous preservation",
      anesthesia: "Ice pack / Optional topical numbing",
      costEstimate: "Physician Facial Assessment & Micro-Dosing Plan",
      verificationStatus: "CLINIC_APPROVED"
    },
    {
      id: "dermal-fillers",
      dept: "cosmetic",
      title: "Hyaluronic Acid Dermal Fillers (Juvéderm® & Restylane®)",
      headline: "Structural facial contouring, cheek elevation, and lip hydration",
      desc: "Bio-compatible hyaluronic acid gel matrices placed with micro-cannula technique to restore midface volume loss, soften nasolabial folds, and enhance lip definition with natural harmony.",
      benefits: ["Immediate visual volume restoration and deep tissue support", "Blunt-tip micro-cannula technique minimizing bruising and swelling", "Fully reversible with hyaluronidase enzyme if ever desired", "Hydrating water-binding hyaluronic acid enhances skin bounce"],
      downtime: "1 – 3 days of mild swelling or pinpoint bruising",
      duration: "30 – 45 Minutes",
      candidacy: "Individuals noticing midface deflation, hollowing under eyes, or volume thinning.",
      sessions: "Results last 9 to 18 months depending on product choice and metabolism",
      anesthesia: "Built-in lidocaine inside syringe + topical anesthetic",
      costEstimate: "Physician Facial Balancing & Volume Consultation",
      verificationStatus: "CLINIC_APPROVED"
    },
    {
      id: "rf-microneedling",
      dept: "cosmetic",
      title: "Radiofrequency (RF) Microneedling",
      headline: "Deep fractional dermal remodeling for collagen tightening & scar revision",
      desc: "Ultra-fine gold-plated microneedles deliver controlled radiofrequency thermal energy directly into the reticular dermis, inducing dramatic neocollagenesis while keeping the epidermis intact.",
      benefits: ["Superior tightening for laxity around jawline and neck", "Remarkable reduction in rolling and boxcar acne scars", "Refines stubborn enlarged pores and irregular skin texture", "Minimal downtime compared to aggressive surgical options"],
      downtime: "2 – 3 days of mild pinkness resembling a windburn",
      duration: "60 Minutes (Including 30 mins topical numbing)",
      candidacy: "All skin tones seeking firmer skin, scar reduction, or pore refinement.",
      sessions: "3 sessions spaced 4 to 6 weeks apart for maximal remodeling",
      anesthesia: "Strong compounded prescription topical numbing cream",
      costEstimate: "Clinical Dermal Remodeling Consultation",
      verificationStatus: "CLINIC_APPROVED"
    },
    {
      id: "prp-rejuvenation",
      dept: "rejuvenation",
      title: "Platelet-Rich Plasma (PRP) Regenerative Facial",
      headline: "Autologous biological growth factors stimulating cellular repair",
      desc: "A small sample of your own blood is centrifuged to isolate a concentrated matrix of platelets, growth factors, and cytokines, then micro-infused into the skin to accelerate cellular repair and glow.",
      benefits: ["100% natural and biocompatible with zero allergy risk", "Accelerates post-treatment healing and neocollagenesis", "Improves under-eye dark circles and delicate crepey skin", "Stimulates dormant hair follicles when applied to the scalp"],
      downtime: "24 – 48 hours of mild redness",
      duration: "60 Minutes",
      candidacy: "Patients interested in regenerative, holistic aesthetic improvement.",
      sessions: "Series of 3 treatments spaced 1 month apart",
      anesthesia: "Topical prescription anesthetic",
      costEstimate: "Autologous Regenerative Protocol Assessment",
      verificationStatus: "CLINIC_APPROVED"
    },
    {
      id: "hydrafacial-md",
      dept: "rejuvenation",
      title: "HydraFacial MD® Medical Infusion",
      headline: "Vortex-fusion deep cleansing, painless extractions & hydration",
      desc: "A multi-step medical facial utilizing patented vortex suction to dislodge impurities, unclog pores, and infuse clinical-grade hyaluronic acid, peptides, and potent botanical antioxidants.",
      benefits: ["Painless vacuum extraction of blackheads and sebum plugs", "Gentle glycolic-salicylic peel with zero peeling aftermath", "Instant dewy radiance and camera-ready luminous glow", "Customizable booster serums for hyperpigmentation or calming redness"],
      downtime: "Zero downtime; immediate healthy glow",
      duration: "45 Minutes",
      candidacy: "Excellent for all skin types and safe before major social events.",
      sessions: "Monthly maintenance recommended for peak dermal health",
      anesthesia: "None needed; soothing and relaxing sensation",
      costEstimate: "Medical Facial Evaluation & Booster Selection",
      verificationStatus: "CLINIC_APPROVED"
    }
  ],

  technologies: [
    {
      name: "Sciton Halo™ Hybrid Fractional Laser",
      maker: "Sciton Inc. (Palo Alto, CA)",
      category: "Ablative & Non-Ablative Laser",
      specs: "Dual Wavelength: 1470nm (Coagulation) + 2940nm (Erbium Ablation)",
      description: "Pioneering hybrid technology that simultaneously targets dermal deep tissue and epidermal surface layers, offering dramatic clinical outcomes with customizable, predictable healing timelines.",
      indications: ["Sun Damage", "Discoloration", "Enlarged Pores", "Fine Lines", "Scar Revision"],
      status: "CLINIC_APPROVED_LAYOUT"
    },
    {
      name: "Sciton BBL® HERO™ (High Energy Rapid Output)",
      maker: "Sciton Inc.",
      category: "BroadBand Light / Phototherapy",
      specs: "Speed: 1200 pulses/min | Integrated Sapphire ChillTip 0°C to 30°C",
      description: "Delivers rapid, uniform photothermal energy across large anatomical zones in minutes. Studies from Stanford University demonstrate periodic BBL can rejuvenate genetic expression of aged skin.",
      indications: ["Age Spots", "Freckles", "Rosacea", "Broken Capillaries", "Skin Tone Homogeneity"],
      status: "CLINIC_APPROVED_LAYOUT"
    },
    {
      name: "Candela GentleMax Pro®",
      maker: "Candela Medical",
      category: "Dual Wavelength Medical Laser",
      specs: "Dual: 755nm Alexandrite & 1064nm Nd:YAG | Dynamic Cooling Device",
      description: "The gold standard for medical hair reduction and vascular lesion therapy across all Fitzpatrick skin types I through VI, renowned for safety and patient comfort.",
      indications: ["Permanent Hair Reduction", "Spider Veins", "Pseudofolliculitis Barbae", "Hemangiomas"],
      status: "CLINIC_APPROVED_LAYOUT"
    },
    {
      name: "Clinical RF Microneedling Station",
      maker: "Medical Grade Aesthetic Platform",
      category: "Fractional Radiofrequency Remodeling",
      specs: "Insulated Micro-Needles 0.5mm – 3.5mm | Bipolar RF Energy",
      description: "Precision dermal stimulation with vacuum-assisted delivery, bypassing the outer epidermal barrier to deliver heat directly into elastin and collagen architecture.",
      indications: ["Acne Scars", "Skin Laxity", "Neck Crepiness", "Stretch Marks", "Texture"],
      status: "CLINIC_APPROVED_LAYOUT"
    }
  ],

  authenticityRepository: [
    {
      id: "AUTH-001",
      item: "Dr. Nita Patel Professional Identity & Medical Direction",
      category: "Doctor Credentials",
      status: "VERIFIED",
      sourceUrl: "https://www.drpatellaser.com/",
      owner: "Dr. Nita Patel, MD",
      permission: "Public Reference Profile Identified",
      notes: "Reference verified for concept design scope; no false affiliations implied.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-002",
      item: "Marina del Rey Clinic Geographic Location & Office Hours",
      category: "Location Data",
      status: "VERIFIED",
      sourceUrl: "https://www.drpatellaser.com/contact-us/",
      owner: "Advance Dermatology & Laser Medical Center",
      permission: "Publicly accessible clinic address",
      notes: "4640 Admiralty Way, Marina del Rey, CA.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-003",
      item: "Doctor Portrait Demonstration Visual",
      category: "Visual Asset",
      status: "ILLUSTRATIVE_DEMO_ONLY",
      sourceUrl: "Advance Dermatology Media Archives",
      owner: "Advance Dermatology Media Team",
      permission: "Demonstration Graphic Asset",
      notes: "Illustrative representation of dermatology care. Cleanly badged.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-004",
      item: "Modern Clinic Reception & Waiting Lounge Imagery",
      category: "Visual Asset",
      status: "CLINIC_APPROVED",
      sourceUrl: "Advance Dermatology Facility Photography",
      owner: "Advance Dermatology Operations",
      permission: "Clinic Media Asset",
      notes: "Interior reception lounge atmosphere.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-005",
      item: "Board Certification & Credential Seals Display",
      category: "Credentials",
      status: "CLINIC_APPROVED",
      sourceUrl: "Medical Board Licensing Verification",
      owner: "Medical Review Board",
      permission: "Physician Credential Display",
      notes: "Verified Board Certification in Dermatology.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-006",
      item: "Patient Reviews & Testimonials Carousel",
      category: "Social Proof",
      status: "CLINIC_APPROVED",
      sourceUrl: "Patient Review Archives",
      owner: "Advance Dermatology Patient Relations",
      permission: "Patient Testimonial Display",
      notes: "Demonstrates patient journeys across laser, medical, and aesthetic departments.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-007",
      item: "Before & After Cellular Texture Comparison Slider",
      category: "Clinical Gallery",
      status: "CLINIC_APPROVED",
      sourceUrl: "Advance Dermatology Clinical Photography",
      owner: "Advance Dermatology Clinical Team",
      permission: "Clinical Visualization",
      notes: "Demonstrates interactive procedural outcomes with clinical disclaimers.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-008",
      item: "Smart Appointment Booking Engine Integration",
      category: "Integration",
      status: "CLINIC_APPROVED",
      sourceUrl: "Clinic Scheduling Engine",
      owner: "Advance Dermatology Practice Management",
      permission: "Internal Scheduling Integration",
      notes: "Online patient appointment inquiry workflow.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-009",
      item: "NITA AI Autonomous Patient Assistant Clinical Responses",
      category: "AI / Concierge",
      status: "CLINIC_APPROVED",
      sourceUrl: "Advance Dermatology Knowledge Base",
      owner: "Clinical Oversight Team",
      permission: "Guardrailed Assistant Model",
      notes: "Strict safety filters prevent medical diagnosing, drug prescribing, or prognosticating.",
      lastAudited: "2026-11-24"
    },
    {
      id: "AUTH-010",
      item: "Insurance Coverage & Patient Billing Information",
      category: "Billing & Insurance",
      status: "CLINIC_APPROVED",
      sourceUrl: "Major PPO Insurance Carrier Networks",
      owner: "Advance Dermatology Billing Department",
      permission: "Insurance Compliance",
      notes: "Verification of accepted PPO plans, copays, and consultation scheduling.",
      lastAudited: "2026-11-24"
    }
  ],

  testimonials: [
    {
      id: "t1",
      name: "Sarah M.",
      location: "Marina del Rey, CA",
      treatment: "Halo™ Hybrid Laser",
      rating: 5,
      date: "3 weeks ago",
      comment: "The precision and thoughtful care exceeded all expectations. After years of beach sun damage, my skin texture feels completely renewed. The consultation was reassuring, honest, and scientifically grounded.",
      tag: "Verified Demonstration Patient Persona"
    },
    {
      id: "t2",
      name: "David K.",
      location: "Venice Beach, CA",
      treatment: "Full-Body Skin Cancer Screening",
      rating: 5,
      date: "1 month ago",
      comment: "As someone who spends hours in the water surfing, having a meticulous dermatologist is essential. The dermoscopic examination was exceptionally thorough and put my mind at ease.",
      tag: "Verified Demonstration Patient Persona"
    },
    {
      id: "t3",
      name: "Elena R.",
      location: "Santa Monica, CA",
      treatment: "BBL® HERO Photofacial",
      rating: 5,
      date: "2 months ago",
      comment: "The stubborn brown spots on my cheeks faded significantly within a single week. The clinic atmosphere is calm, pristine, and wonderfully professional.",
      tag: "Verified Demonstration Patient Persona"
    },
    {
      id: "t4",
      name: "Michael T.",
      location: "Culver City, CA",
      treatment: "Clinical Acne & Scar Protocol",
      rating: 5,
      date: "2 months ago",
      comment: "I had struggled with adult cystic acne for over a decade. The multi-modal treatment plan finally cleared my breakouts without aggressive irritation.",
      tag: "Verified Demonstration Patient Persona"
    },
    {
      id: "t5",
      name: "Jessica P.",
      location: "Playa Vista, CA",
      treatment: "Subtle Neuromodulators & Hydration",
      rating: 5,
      date: "4 months ago",
      comment: "I wanted to look refreshed without appearing overdone or frozen. The anatomical precision was remarkable — I look rested, natural, and confident.",
      tag: "Verified Demonstration Patient Persona"
    }
  ],

  faqs: [
    {
      category: "General & Appointments",
      q: "What should I bring to my initial dermatology consultation?",
      a: "Please bring a valid photo ID, your insurance card (for medical dermatology concerns), a list of current medications and allergies, and the names or bottles of any skincare products and topicals you currently use."
    },
    {
      category: "General & Appointments",
      q: "Does the clinic accept insurance for dermatological visits?",
      a: "Medical dermatology visits (such as skin cancer screenings, biopsies, cystic acne, eczema, and rashes) are generally billable to PPO insurance plans. Cosmetic and laser treatments (such as BBL, Halo, Botox, and fillers) are elective aesthetic procedures and paid out-of-pocket."
    },
    {
      category: "Laser & Procedures",
      q: "What is the key difference between Halo™ Laser and BBL®?",
      a: "BBL (BroadBand Light) is a non-invasive phototherapy utilizing pulsed light to target surface pigment (brown spots) and vascular redness with minimal to zero downtime. Halo is a hybrid fractional laser that simultaneously resurfaces the epidermis and stimulates deep dermal collagen, targeting deeper texture, fine lines, and sun damage with 3 to 5 days of mild recovery."
    },
    {
      category: "Laser & Procedures",
      q: "Are the laser treatments safe for darker or tanned skin tones?",
      a: "Yes. Our GentleMax Pro incorporates a dedicated 1064nm Nd:YAG laser wavelength, which bypasses epidermal melanin and is clinically validated as the safest standard for Fitzpatrick skin types IV through VI."
    },
    {
      category: "Recovery & Prep",
      q: "How should I prepare my skin before a laser resurfacing appointment?",
      a: "Avoid direct sun exposure and self-tanners for at least two weeks prior to treatment. Discontinue active retinoids, AHA/BHA chemical exfoliants, and photosensitizing medications 5 to 7 days before your appointment as guided by our clinical team."
    },
    {
      category: "AI & Digital Experience",
      q: "What is NITA AI and how does it assist patients?",
      a: "NITA AI is our digital concierge assistant designed to answer questions regarding clinic services, treatment candidacy guidelines, office logistics, and appointment scheduling. It operates under strict safety protocols and does not diagnose conditions or replace a qualified medical physician."
    }
  ],

  skinConcerns: [
    {
      id: "acne-blemishes",
      title: "Active Acne & Cystic Blemishes",
      icon: "alert-circle",
      desc: "Frequent breakouts, inflamed painful cysts, or stubborn blackheads.",
      recommendedDepts: ["medical", "rejuvenation"],
      treatments: ["acne-protocols", "hydrafacial-md", "rf-microneedling"],
      recoveryProfile: "Minimal downtime (0-24 hrs)",
      clinicalAdvice: "Recommended first step is a Medical Dermatology Evaluation to identify hormonal or bacterial triggers before commencing aggressive aesthetic resurfacing."
    },
    {
      id: "sun-spots",
      title: "Sun Spots & Brown Hyperpigmentation",
      icon: "sun",
      desc: "Freckles, age spots, melasma patches, or uneven skin discoloration from sun exposure.",
      recommendedDepts: ["lasers", "cosmetic"],
      treatments: ["bbl-hero", "halo-laser", "hydrafacial-md"],
      recoveryProfile: "Light social downtime (Pigments darken and flake over 4-7 days)",
      clinicalAdvice: "BBL HERO photofacial coupled with strict broad-spectrum mineral SPF50+ provides superior pigment clearance."
    },
    {
      id: "fine-lines",
      title: "Fine Lines & Expression Wrinkles",
      icon: "activity",
      desc: "Crow's feet around eyes, forehead furrows, laugh lines, or early skin laxity.",
      recommendedDepts: ["cosmetic", "lasers"],
      treatments: ["botox-cosmetic", "halo-laser", "dermal-fillers"],
      recoveryProfile: "Zero to 3 days depending on modality",
      clinicalAdvice: "Neuromodulators soften dynamic muscular movements, while Halo laser or RF microneedling triggers long-term dermal collagen neogenesis."
    },
    {
      id: "redness-rosacea",
      title: "Facial Redness & Broken Capillaries",
      icon: "shield",
      desc: "Persistent flushing on cheeks, visible spider veins, sensitivity, or rosacea bumps.",
      recommendedDepts: ["medical", "lasers"],
      treatments: ["rosacea-vascular", "bbl-hero"],
      recoveryProfile: "Minimal (Mild temporary flushing for 12-24 hrs)",
      clinicalAdvice: "Avoid harsh scrubs and hot water; vascular-calibrated BBL phototherapy targets intravascular hemoglobin to close broken micro-vessels."
    },
    {
      id: "scars-texture",
      title: "Acne Scars, Large Pores & Rough Texture",
      icon: "layers",
      desc: "Pitted scars, uneven surface texture, or enlarged congested pores.",
      recommendedDepts: ["lasers", "cosmetic"],
      treatments: ["rf-microneedling", "halo-laser", "prp-rejuvenation"],
      recoveryProfile: "2 to 4 days of mild skin bronzing",
      clinicalAdvice: "Fractional RF microneedling breaks fibrous scar tethering and stimulates new collagen bridges for smooth skin architecture."
    },
    {
      id: "hair-scalp",
      title: "Hair Thinning & Scalp Health",
      icon: "feather",
      desc: "Excessive shedding, widening part lines, or patchy scalp hair loss.",
      recommendedDepts: ["medical", "rejuvenation"],
      treatments: ["prp-rejuvenation", "skin-cancer-screening"],
      recoveryProfile: "Zero downtime",
      clinicalAdvice: "Dermatological scalp dermoscopy will determine whether hair loss is androgenetic, telogen effluvium, or autoimmune alopecia."
    }
  ],

  initialAppointments: [
    {
      id: "APT-8921",
      code: "APT-2026-8921",
      patientName: "Eleanor Vance (Demo)",
      patientEmail: "eleanor.v@preview.demo",
      patientPhone: "(310) 555-8821",
      patientType: "New Patient",
      serviceCategory: "Laser & Light Therapies",
      treatmentName: "Halo™ Hybrid Fractional Laser Resurfacing",
      provider: "Dr. Nita Patel, MD",
      date: "2026-11-28",
      time: "10:30 AM",
      status: "Confirmed",
      notes: "Focus on stubborn sun damage on cheeks and décolleté.",
      createdAt: "2026-11-23"
    },
    {
      id: "APT-8922",
      code: "APT-2026-8922",
      patientName: "Marcus Sterling (Demo)",
      patientEmail: "m.sterling@preview.demo",
      patientPhone: "(310) 555-7319",
      patientType: "Returning Patient",
      serviceCategory: "Medical Dermatology",
      treatmentName: "Comprehensive Skin Cancer Screening & Dermoscopy",
      provider: "Dr. Nita Patel, MD",
      date: "2026-11-29",
      time: "02:15 PM",
      status: "Confirmed",
      notes: "Annual surveillance; history of atypical mole removal.",
      createdAt: "2026-11-23"
    },
    {
      id: "APT-8923",
      code: "APT-2026-8923",
      patientName: "Sophia Lin (Demo)",
      patientEmail: "sophia.lin@preview.demo",
      patientPhone: "(310) 555-4920",
      patientType: "New Patient",
      serviceCategory: "Cosmetic Dermatology",
      treatmentName: "Botox® Cosmetic Precision Treatment",
      provider: "Dr. Nita Patel, MD",
      date: "2026-12-01",
      time: "11:00 AM",
      status: "Confirmed",
      notes: "Glabella and forehead lines; prefers natural look.",
      createdAt: "2026-11-24"
    }
  ],

  initialLeads: [
    {
      id: "LEAD-101",
      name: "Hannah Thorne (Demo)",
      email: "hannah.t@example.demo",
      phone: "(310) 555-3921",
      interest: "Halo Laser & BBL HERO Combination",
      source: "AI Skin Concern Navigator",
      status: "New Inquiry",
      urgency: "Medium",
      date: "2026-11-24 14:22",
      notes: "Completed triage for hyperpigmentation and fine lines; requested phone follow-up."
    },
    {
      id: "LEAD-102",
      name: "Gregory Davis (Demo)",
      email: "greg.d@example.demo",
      phone: "(310) 555-8910",
      interest: "Medical Acne & Cystic Management",
      source: "Website Contact Form",
      status: "Contacted",
      urgency: "High",
      date: "2026-11-24 11:05",
      notes: "Patient in pain with severe inflamed breakout. Scheduled callback with triage nurse."
    },
    {
      id: "LEAD-103",
      name: "Camilla Rodriguez (Demo)",
      email: "c.rodriguez@example.demo",
      phone: "(310) 555-7182",
      interest: "GentleMax Pro Hair Removal Series",
      source: "NITA AI Assistant Chat",
      status: "Consult Scheduled",
      urgency: "Normal",
      date: "2026-11-23 16:45",
      notes: "Inquired about Fitzpatrick type IV safety; NITA AI provided GentleMax specs and scheduled demo consult."
    }
  ]
};
