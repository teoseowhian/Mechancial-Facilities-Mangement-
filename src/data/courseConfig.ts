/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeekData {
  weekNumber: number;
  dateStr: string;
  startDate: string; // ISO format for current week comparison YYYY-MM-DD
  endDate: string;
  venue: string;
  isOnCampus: boolean;
  topic: string;
  cardTitle: string;
  headline: string;
  illustrationType: 
    | 'sprinkler'
    | 'loop'
    | 'riser'
    | 'stack'
    | 'hardhat'
    | 'grid'
    | 'fan'
    | 'burner'
    | 'clipboard'
    | 'split_ahu'
    | 'duct'
    | 'chiller';
  diagramSubLabel?: string;
  coveredSummary: string;
  coveredBullets: string[];
  tutorialQuestions: string[];
  isTestOrPractical: boolean;
  links: {
    lectureNotes?: string;
    tutorial?: string;
    answerKey?: string;
    recording?: string;
  };
  interactiveTab?: 
    | 'ieq'
    | 'chillers'
    | 'ventilation'
    | 'psychrometrics'
    | 'water_plumbing'
    | 'fire'
    | 'gas'
    | 'ducts'
    | 'minigames';
}

export const COURSE_CONFIG = {
  institution: "Ngee Ann Polytechnic",
  course: "Diploma (Conversion) in Facilities Management",
  moduleName: "Mechanical Systems",
  moduleId: "013621 / 101MS3",
  semester: "Oct 2026",
  classTime: "Mondays, 6:30 pm – 9:30 pm (MS Teams unless stated)",
  lecturer: "David Teo",
  email: "tsh52@np.edu.sg",
  lmsUrl: "https://lms.polite.edu.sg/d2l/home/1023236",
  recordingsUrl: "", // empty for now -> displays "Recordings: coming soon"
  driveUrl: "https://drive.google.com/drive/folders/1K8-_9fqSSfC-c2svSE-6ydwdwWcC7nQE",
  accent: "#C8102E", // academic poster red
  text: "#1A1A1A",
  muted: "#6B6B6B",
  border: "#E5E5E5",

  assessments: [
    { title: "Common Test 1", weight: 20, venue: "Blk 34 #03-02 (Week 9)", type: "Individual" },
    { title: "Written Test 2", weight: 20, venue: "Blk 34 #03-02 (Week 15)", type: "Individual" },
    { title: "Assignment", weight: 40, venue: "Submission via LMS", type: "Individual" },
    { title: "Class Work", weight: 20, venue: "Continuous & Lab Reports", type: "Individual" },
  ],

  vacationBreak: {
    label: "Vacation break",
    period: "21 Dec 2026 – 3 Jan 2027",
    startDate: "2026-12-21",
    endDate: "2027-01-03",
  },

  weeks: [
    {
      weekNumber: 1,
      dateStr: "Mon 19 Oct 2026",
      startDate: "2026-10-19",
      endDate: "2026-10-25",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Fire Protection Systems 1 & 2",
      cardTitle: "Fire Protection",
      headline: "Detect, alarm and suppress",
      illustrationType: "sprinkler",
      diagramSubLabel: "CP 52 · 36m Hose Reel",
      coveredSummary: "Fire protection systems parts 1 and 2: SCDF Fire Code 2023, wet and dry rising mains, automatic sprinkler systems, fire hose reels, and portable fire extinguishers.",
      coveredBullets: [
        "SCDF Fire Code 2023 submission framework: Prescriptive vs Performance-based",
        "Dry rising mains (buildings 10m to 60m) vs wet rising mains (> 60m height)",
        "CP 52 automatic sprinkler systems: wet pipe, dry pipe, pre-action, deluge",
        "Sprinkler head classifications, temperature ratings (68°C standard), and spacing",
        "Fire hose reel coverage (36m total reach: 30m hose + 6m water jet)",
        "SS 578 portable fire extinguisher selection (Class A, B, C, D, F) and PASS protocol"
      ],
      tutorialQuestions: [
        "1 System overview: SCDF regulatory framework and Fire Code 2023 objectives",
        "2 Rising mains: criteria for installing dry risers vs charged wet rising mains",
        "3 Sprinkler systems: operational differences between wet, dry, pre-action and deluge systems",
        "4 Hazard classification: Light Hazard (LH), Ordinary Hazard (OH), and High Hazard (HH) design densities",
        "5 Hose reels: 36m coverage circle planning and hydraulic pressure requirements",
        "6 Extinguishers: matching extinguisher types with fuel classes in plant rooms",
        "7 Smoke control: mechanical smoke purging interlocks and fire command center signals"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "fire"
    },
    {
      weekNumber: 2,
      dateStr: "Mon 26 Oct 2026",
      startDate: "2026-10-26",
      endDate: "2026-11-01",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Water Circuits",
      cardTitle: "Water Circuits",
      headline: "How water moves through a building",
      illustrationType: "loop",
      diagramSubLabel: "ΔP = f(L/D)(ρv²/2)",
      coveredSummary: "Closed and open hydronic water circuits, primary and secondary chilled water loops, condenser water circuits to cooling towers, pipe friction losses, and circuit balancing.",
      coveredBullets: [
        "Primary vs secondary chilled water loops and hydraulic decoupling",
        "Decoupler pipe sizing and zero pressure differential neutral point",
        "Condenser water open circuits to cooling towers and legionella prevention",
        "Darcy-Weisbach & Hazen-Williams head loss calculation in commercial piping",
        "Control valve authority (2-way modulating vs 3-way diverting valves)",
        "Air separators, expansion tanks, and system pressurisation units"
      ],
      tutorialQuestions: [
        "1 Primary-secondary pumping: why decoupler pipes prevent pump interference",
        "2 Head loss: calculate frictional pressure drop across a 150mm condenser riser",
        "3 Decoupler flow direction: diagnosing deficit vs surplus flow conditions",
        "4 Valve authority: why poor valve authority causes hunting and overflow",
        "5 Expansion tanks: sizing diaphragm tanks for volumetric thermal expansion",
        "6 Hydronic balancing: static vs dynamic pressure-independent control valves (PICV)",
        "7 Cooling tower piping: equalizing lines and sump vortex prevention"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "chillers"
    },
    {
      weekNumber: 3,
      dateStr: "Mon 2 Nov 2026",
      startDate: "2026-11-02",
      endDate: "2026-11-08",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Water Supply Systems",
      cardTitle: "Water Supply",
      headline: "From the four national taps to the building tap",
      illustrationType: "riser",
      diagramSubLabel: "SS 636 · Head ≤ 35m",
      coveredSummary: "Four National Taps, direct/indirect supply modes, pressure reduction in high-rise, single vs multi-stage pumping, metering, storage tanks, pipe materials, WELS.",
      coveredBullets: [
        "Singapore's Four National Taps: Local Catchment, Imported, NEWater, Desalinated",
        "PUB Water Supply Modes 1, 2, and 3 based on supply pressure and Reduced Level",
        "High-rise pressure management: appliance pressure head limited to <= 35m via PRVs",
        "Suction tanks and roof gravity storage tanks: dual-compartment rule (> 4500L)",
        "Pumping systems: hydro-pneumatic booster sets vs roof gravity transfer pumps",
        "Pipe materials: copper, stainless steel, ductile iron, and PUB WELS water efficiency"
      ],
      tutorialQuestions: [
        "1 System overview: Singapore's Four National Taps and supply security",
        "2 Water supply modes: direct, indirect, and hydro-pneumatic booster systems",
        "3 Pressure management: max 35m head limit and PRV pressure zoning",
        "4 Pump operation: duty/standby staging, flow rate and static head sizing",
        "5 Water metering: master meters, sub-meters and PUB requirements",
        "6 Storage tank design: suction vs roof gravity tanks, dual-compartment rule",
        "7 Pipe materials: copper, ductile iron, stainless steel, and uPVC",
        "8 Regulations and fittings: PUB Code of Practice (SS 636) and WELS rating"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "water_plumbing"
    },
    {
      weekNumber: 4,
      dateStr: "Wed 11 Nov 2026",
      startDate: "2026-11-09",
      endDate: "2026-11-15",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Sanitary Plumbing & Drainage Systems",
      cardTitle: "Sanitary Plumbing",
      headline: "Where the waste water goes",
      illustrationType: "stack",
      diagramSubLabel: "P-Trap · 50mm Seal",
      coveredSummary: "Plumbing vs drainage, appliances, traps, stack systems, uPVC vs cast iron, inspection chambers, grease traps, drain line design, sump pumps and ejectors.",
      coveredBullets: [
        "Above-ground sanitary plumbing vs below-ground building drainage",
        "Sanitary appliances: Discharge Units (DU) and hydraulic fixture ratings",
        "Traps and water seals: 50mm minimum depth and 5 mechanisms of trap seal loss",
        "Stack systems: single stack, ventilated stack, and modified single stack",
        "Material selection: uPVC vs cast iron (acoustic dampening and fire collars)",
        "Inspection chambers, grease traps, and basement sewage ejector stations"
      ],
      tutorialQuestions: [
        "1 Plumbing vs drainage: above-ground plumbing vs below-ground drainage",
        "2 Sanitary appliances: discharge units (DU) and hydraulic fixture ratings",
        "3 System components: soil, waste, and ventilating pipework",
        "4 Traps: P-traps, S-traps, minimum 50mm seal and loss mechanisms",
        "5 Stack systems: single stack, fully ventilated, and modified single stack",
        "6 uPVC vs cast iron: acoustic, fire rating, expansion, and durability pros/cons",
        "7 Inspection chambers: spacing, sizing, invert levels, and benching",
        "8 Grease traps: commercial FOG retention and maintenance standards",
        "9 Drain line design: gradient rules (1:40 to 1:100) and self-cleansing velocity",
        "10 Sump pumps and sewage ejectors: basement drainage and dual pump setups"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "water_plumbing"
    },
    {
      weekNumber: 5,
      dateStr: "Mon 16 Nov 2026",
      startDate: "2026-11-16",
      endDate: "2026-11-22",
      venue: "Blk 34 #03-02",
      isOnCampus: true,
      topic: "Practical 1 (in school), with Supandi",
      cardTitle: "Practical 1",
      headline: "Hands-on in the lab",
      illustrationType: "hardhat",
      diagramSubLabel: "Blk 34 #03-02 · Lab",
      coveredSummary: "Hands-on laboratory session at Blk 34 #03-02 with Supandi. Practical 1: Indoor Environmental Quality (IEQ) measurements — Sling Psychrometer vs TSI VelociCalc, thermal comfort under SS 554 : 2016, and report generation.",
      coveredBullets: [
        "Hands-on instrumentation: whirling/sling psychrometer operation and wick wetting",
        "Digital air measurement: TSI VelociCalc electronic multi-meter calibration",
        "Dry-bulb, wet-bulb, relative humidity, air speed, and CO2 data logging",
        "Percentage difference formula: |A - B| / A * 100% calculation and error analysis",
        "SS 554 : 2016 physical parameter compliance check (24°C ± 1°C, RH <= 65%, 0.2 m/s)",
        "Formal laboratory practical submittal report generation"
      ],
      tutorialQuestions: [],
      isTestOrPractical: true,
      links: {
        lectureNotes: "",
        tutorial: "",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "ieq"
    },
    {
      weekNumber: 6,
      dateStr: "Mon 23 Nov 2026",
      startDate: "2026-11-23",
      endDate: "2026-11-29",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Mechanical Drawings",
      cardTitle: "M&E Drawings",
      headline: "Reading M&E drawings",
      illustrationType: "grid",
      diagramSubLabel: "CP 83 · P&ID Layout",
      coveredSummary: "Reading and interpreting M&E schematic diagrams, floor layouts, CP 83 CAD conventions, piping and instrumentation diagrams (P&ID), and service coordination.",
      coveredBullets: [
        "CP 83 Singapore CAD layer and graphic standard conventions",
        "Schematic diagrams vs layout floor plans: elevations, invert levels, and invert heights",
        "Single-line vs double-line ductwork and piping drawing interpretations",
        "Mechanical symbols: valves, strainers, balancing dampers, VAV boxes, and sensors",
        "Combined Services Drawings (CSD) and clash detection with structural beams"
      ],
      tutorialQuestions: [
        "1 CP 83 CAD layering and symbol standards",
        "2 Single-line vs double-line duct drawings",
        "3 Schematic vs layout drawings: interpreting elevation and invert levels",
        "4 Piping symbols: check valves, strainer, balancing valve, PRV",
        "5 Section views: resolving clashes with structural beams and cable trays"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "ducts"
    },
    {
      weekNumber: 7,
      dateStr: "Mon 30 Nov 2026",
      startDate: "2026-11-30",
      endDate: "2026-12-06",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Mechanical Ventilation Systems",
      cardTitle: "Ventilation",
      headline: "Moving air in and out",
      illustrationType: "fan",
      diagramSubLabel: "SS 553 · Ft ≤ 110 N",
      coveredSummary: "Air changes per hour (ACH) under SS 553, basement carpark ventilation with CO sensors and 650 mm low-level exhaust, commercial kitchen exhaust ducts, fan affinity laws, and staircase pressurisation.",
      coveredBullets: [
        "Minimum Air Changes per Hour (ACH) for 9 commercial building spaces under SS 553",
        "Basement carpark ventilation: 6 ACH or CO sensor control with 50% exhaust <= 650mm",
        "Commercial kitchen exhaust: >= 20 ACH, 9 m/s duct velocity, no fire dampers",
        "Fan affinity laws: volumetric flow, total pressure, and power consumption relationships",
        "Fire safety: staircase pressurisation (50-60 Pa) and door opening force Ft <= 110 N"
      ],
      tutorialQuestions: [
        "1 SS 553 minimum air change rates across commercial spaces",
        "2 Car park ventilation: continuous 6 ACH vs demand CO sensor operation",
        "3 50% exhaust extraction below 650 mm floor level for petrol fumes",
        "4 Kitchen exhaust velocity (9 m/s) and fire safety separation",
        "5 Fan affinity laws: calculating speed, pressure and power changes",
        "6 Staircase pressurisation door opening force (Ft <= 110 N)"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "ventilation"
    },
    {
      weekNumber: 8,
      dateStr: "Mon 7 Dec 2026",
      startDate: "2026-12-07",
      endDate: "2026-12-13",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Town Gas, and Revision",
      cardTitle: "Town Gas & Revision",
      headline: "Safe gas from the main to the burner",
      illustrationType: "burner",
      diagramSubLabel: "SG = 0.52 · SS 608",
      coveredSummary: "Composition and properties, complete combustion, commercial kitchen piping, routing, purging and charging-in, annual inspection, soundness and pressure tests, corrosion protection.",
      coveredBullets: [
        "Town gas composition: hydrogen and methane, specific gravity 0.52 (lighter than air)",
        "Combustion dynamics: complete combustion, stoichiometric air requirements, CO hazards",
        "Commercial kitchen gas piping: solenoid shut-off valves interlocked with exhaust fan",
        "Soundness testing: 300 mm WG manometer test and zero pressure drop rule",
        "Pipe routing: avoiding unventilated cavities, sleeves through building fabric, corrosion wrapping"
      ],
      tutorialQuestions: [
        "1 Composition: synthetic natural gas, methane, and hydrogen content",
        "2 Characteristics: specific gravity (0.52 - lighter than air), calorific value, and flammability limits",
        "3 Complete combustion: stoichiometric air-fuel ratio and CO prevention",
        "4 Kitchen piping components: isolation valves, gas meters, emergency shut-off valves",
        "5 Pipe routing: avoiding unventilated voids, lift shafts, and electrical ducts",
        "6 Purging and charging-in: nitrogen displacement and flare-off procedures",
        "7 Annual inspection: EMA licensed gas service worker (GSW) checks",
        "8 Soundness test: manometer U-gauge stabilization and drop evaluation",
        "9 Pressure test: test pressure benchmarks and safety margins (SS 608)",
        "10 Corrosion protection: wrapping, sleeve pipes, and cathodic protection"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "gas"
    },
    {
      weekNumber: 9,
      dateStr: "Mon 14 Dec 2026",
      startDate: "2026-12-14",
      endDate: "2026-12-20",
      venue: "Blk 34 #03-02",
      isOnCampus: true,
      topic: "Common Test 1 (on campus)",
      cardTitle: "Common Test 1",
      headline: "Test on campus",
      illustrationType: "clipboard",
      diagramSubLabel: "Weightage: 20%",
      coveredSummary: "Common Test 1 on campus at Blk 34 #03-02. Covers Fire Protection, Water Circuits, Water Supply, Sanitary Plumbing, Mechanical Ventilation, and Town Gas (Weeks 1 to 8). Weightage: 20%.",
      coveredBullets: [
        "Venue: Blk 34 #03-02, 6:30 pm sharp",
        "Scope: Weeks 1 to 8 (Fire protection, water supply, sanitary plumbing, ventilation, town gas)",
        "Format: Multiple choice questions, calculation problems, and schematic interpretation",
        "Assessment weightage: 20% of overall module score (Individual assessment)"
      ],
      tutorialQuestions: [],
      isTestOrPractical: true,
      links: {
        lectureNotes: "",
        tutorial: "",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "minigames"
    },
    // Vacation Break between Week 9 and 10 (21 Dec 2026 – 3 Jan 2027)
    {
      weekNumber: 10,
      dateStr: "Mon 4 Jan 2027",
      startDate: "2027-01-04",
      endDate: "2027-01-10",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Air-conditioning 1",
      cardTitle: "Air-conditioning 1",
      headline: "Cooling basics",
      illustrationType: "split_ahu",
      diagramSubLabel: "SCL = ṁ · cp · ΔT",
      coveredSummary: "Fundamentals of air conditioning: psychrometric chart (DBT, WBT, RH, enthalpy, moisture content), comfort air conditioning, Sensible Cooling Load equation, and the vapor compression refrigeration cycle.",
      coveredBullets: [
        "Psychrometric chart parameters: Dry-Bulb, Wet-Bulb, Dew Point, RH, Enthalpy, Humidity Ratio",
        "Air-conditioning processes: Sensible cooling, cooling and dehumidification, heating, humidifying",
        "Sensible Cooling Load (SCL = ṁs × cp,a × (tr - ts)) and room sensible heat ratio",
        "Four core components of vapor compression cycle: compressor, condenser, expansion valve, evaporator",
        "Pressure-Enthalpy (P-h) diagram analysis and COP calculation"
      ],
      tutorialQuestions: [
        "1 Dry bulb temperature vs wet bulb temperature on psychrometric chart",
        "2 Sensible vs latent cooling load calculation",
        "3 Sensible Heat Factor (SHF) and coil bypass factor",
        "4 Refrigeration cycle components: compressor, condenser, expansion valve, evaporator",
        "5 Temperature and pressure states across refrigerant R-134a/R-410A"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "psychrometrics"
    },
    {
      weekNumber: 11,
      dateStr: "Mon 11 Jan 2027",
      startDate: "2027-01-11",
      endDate: "2027-01-17",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Air-conditioning 2",
      cardTitle: "Air-conditioning 2",
      headline: "AC systems in buildings",
      illustrationType: "split_ahu",
      diagramSubLabel: "DX · VRF · AHU",
      coveredSummary: "Air-conditioning system typologies: Direct Expansion (DX) split units, Multi-split, Variable Refrigerant Flow (VRF), Air Handling Units (AHU), and Fan Coil Units (FCU). Filtration, coils, and condensate drainage.",
      coveredBullets: [
        "System comparison: DX split units vs multi-split vs Variable Refrigerant Flow (VRF)",
        "Central systems: Air Handling Units (AHU) and Fan Coil Units (FCU)",
        "AHU internal anatomy: pre-filters, secondary filters, chilled water coil, supply fan, condensate tray",
        "Condensate drain trap design: preventing air pull-through and water spillage",
        "Variable Air Volume (VAV) terminal boxes and zone temperature control"
      ],
      tutorialQuestions: [
        "1 DX split systems vs central chilled water: capital vs operating costs",
        "2 VRF heat recovery: simultaneous cooling and heating",
        "3 AHU component sequence: filter, cooling coil, fan, condensate pan",
        "4 Face and bypass dampers vs variable air volume (VAV) modulation",
        "5 Condensate drainage trap sizing (pull-through vs blow-through coils)"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "psychrometrics"
    },
    {
      weekNumber: 12,
      dateStr: "Mon 18 Jan 2027",
      startDate: "2027-01-18",
      endDate: "2027-01-24",
      venue: "Blk 34 #03-02",
      isOnCampus: true,
      topic: "Air-conditioning Systems (Practical), with Supandi",
      cardTitle: "AC Practical",
      headline: "Hands-on with AC systems",
      illustrationType: "hardhat",
      diagramSubLabel: "Blk 34 #03-02 · AHU Lab",
      coveredSummary: "Hands-on laboratory session at Blk 34 #03-02 with Supandi. AC systems inspection, psychrometric temperature drops across cooling coils, air balancing measurements with anemometer / hood, and refrigeration system component identification.",
      coveredBullets: [
        "Hands-on inspection of AHU, FCU, and split unit refrigeration circuits",
        "Measurement of dry-bulb and wet-bulb temperatures entering and leaving cooling coils",
        "Airflow measurement using rotating vane anemometer and flow capture hood",
        "Evaluation of coil bypass factor and sensible cooling performance",
        "Troubleshooting refrigeration faults: refrigerant undercharge, blocked filters, icing"
      ],
      tutorialQuestions: [],
      isTestOrPractical: true,
      links: {
        lectureNotes: "",
        tutorial: "",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "ieq"
    },
    {
      weekNumber: 13,
      dateStr: "Mon 25 Jan 2027",
      startDate: "2027-01-25",
      endDate: "2027-01-31",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Air Systems",
      cardTitle: "Air Distribution",
      headline: "Ducts, fans and air distribution",
      illustrationType: "duct",
      diagramSubLabel: "Huebscher Eq. · Aspect ≤ 4:1",
      coveredSummary: "Air distribution ductwork design, Equal Friction and Velocity Reduction methods, circular to rectangular equivalent diameter (Huebscher formula), aspect ratios, diffusers, grilles, and balancing dampers.",
      coveredBullets: [
        "Air distribution ductwork design: Equal Friction method and Velocity Reduction method",
        "Circular to rectangular duct equivalent diameter using the Huebscher formula",
        "Aspect ratio considerations (recommended <= 4:1) to prevent acoustic rumbling and turbulence",
        "Supply air diffusers (swirl, slot, 4-way), return grilles, and room air throw patterns",
        "Duct fittings loss coefficients, volume control dampers (VCD), and fire dampers"
      ],
      tutorialQuestions: [
        "1 Equal friction method vs static regain method for duct sizing",
        "2 Aspect ratio limits (width to height <= 4:1) to prevent acoustic rumble",
        "3 Huebscher formula for equivalent rectangular duct sizing",
        "4 Diffuser throw, drop, and room air motion distribution",
        "5 Fire dampers and motorized smoke dampers in duct penetration"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "ducts"
    },
    {
      weekNumber: 14,
      dateStr: "Mon 1 Feb 2027",
      startDate: "2027-02-01",
      endDate: "2027-02-07",
      venue: "MS Teams",
      isOnCampus: false,
      topic: "Chiller Plant Efficiency, and Revision",
      cardTitle: "Chiller Efficiency",
      headline: "Getting more cooling per kW",
      illustrationType: "chiller",
      diagramSubLabel: "GM 2021 · kW/RT ≤ 0.68",
      coveredSummary: "Central chilled water plant optimization, BCA Green Mark 2021 efficiency benchmarks (kW/RT), chiller COP, condenser water temperature relief, VSD pump energy savings, part-load polynomials, and final revision.",
      coveredBullets: [
        "Overall plant efficiency: BCA Green Mark 2021 standard (<= 0.68 kW/RT for SLE / Platinum)",
        "Equipment power breakdown: Chillers, CHW pumps, CW pumps, and Cooling Tower fans",
        "Chiller efficiency improvement via condenser water temperature relief (lift reduction)",
        "Variable Speed Drive (VSD) pump energy savings via pump affinity cubic law",
        "Chiller starting sequence and surge avoidance at low load conditions"
      ],
      tutorialQuestions: [
        "1 Overall plant efficiency target: <= 0.68 kW/RT (Green Mark Platinum / SLE)",
        "2 Chiller, CHWP, CWP, and CT fan individual kW/RT breakdown",
        "3 Lift reduction: lowering cooling tower leaving water temperature",
        "4 Part-load polynomial calculations for pumps and chillers",
        "5 Chiller surge avoidance and variable flow low-limit control"
      ],
      isTestOrPractical: false,
      links: {
        lectureNotes: "https://lms.polite.edu.sg/d2l/home/1023236",
        tutorial: "https://lms.polite.edu.sg/d2l/home/1023236",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "chillers"
    },
    {
      weekNumber: 15,
      dateStr: "Wed 10 Feb 2027",
      startDate: "2027-02-08",
      endDate: "2027-02-14",
      venue: "Blk 34 #03-02",
      isOnCampus: true,
      topic: "Test 2 (on campus). CNY break 5–8 Feb 2027",
      cardTitle: "Test 2",
      headline: "Test on campus",
      illustrationType: "clipboard",
      diagramSubLabel: "Weightage: 20% · Final",
      coveredSummary: "Final Written Test 2 on campus at Blk 34 #03-02. Chinese New Year break 5–8 Feb 2027. Covers Air-conditioning, Psychrometrics, Air Distribution Systems, Chiller Plant Efficiency, and comprehensive module review. Weightage: 20%.",
      coveredBullets: [
        "Venue: Blk 34 #03-02, 6:30 pm sharp (Wednesday 10 Feb 2027)",
        "Scope: Weeks 10 to 14 (Air-conditioning fundamentals, psychrometrics, air systems, chiller plant efficiency)",
        "Note: Chinese New Year holiday observed 5–8 Feb 2027 prior to test session",
        "Assessment weightage: 20% of overall module score (Individual assessment)"
      ],
      tutorialQuestions: [],
      isTestOrPractical: true,
      links: {
        lectureNotes: "",
        tutorial: "",
        answerKey: "",
        recording: ""
      },
      interactiveTab: "minigames"
    }
  ] as WeekData[]
};

/**
 * Calculates current week status based on today's date
 */
export function getCurrentWeekStatus(today: Date = new Date()): {
  type: 'before' | 'week' | 'vacation' | 'ended';
  weekNumber?: number;
  displayText: string;
} {
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const firstWeek = COURSE_CONFIG.weeks[0];
  const lastWeek = COURSE_CONFIG.weeks[COURSE_CONFIG.weeks.length - 1];

  if (todayStr < firstWeek.startDate) {
    return {
      type: 'before',
      displayText: 'Starts 19 Oct 2026'
    };
  }

  // Check vacation break: 2026-12-21 to 2027-01-03
  if (todayStr >= COURSE_CONFIG.vacationBreak.startDate && todayStr <= COURSE_CONFIG.vacationBreak.endDate) {
    return {
      type: 'vacation',
      displayText: 'Vacation break, classes resume 4 Jan 2027'
    };
  }

  if (todayStr > lastWeek.endDate) {
    return {
      type: 'ended',
      displayText: 'Semester ended'
    };
  }

  // Find active week
  for (const wk of COURSE_CONFIG.weeks) {
    if (todayStr >= wk.startDate && todayStr <= wk.endDate) {
      return {
        type: 'week',
        weekNumber: wk.weekNumber,
        displayText: `Week ${wk.weekNumber} · ${wk.topic} · ${wk.dateStr} · ${wk.venue}`
      };
    }
  }

  // Fallback to closest subsequent or preceding week
  const pastWeeks = COURSE_CONFIG.weeks.filter(w => w.startDate <= todayStr);
  if (pastWeeks.length > 0) {
    const cur = pastWeeks[pastWeeks.length - 1];
    return {
      type: 'week',
      weekNumber: cur.weekNumber,
      displayText: `Week ${cur.weekNumber} · ${cur.topic} · ${cur.dateStr} · ${cur.venue}`
    };
  }

  return {
    type: 'before',
    displayText: 'Starts 19 Oct 2026'
  };
}
