/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI if key available
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are "MechApp Studio AI" (also known as Mech for FM AI), an expert Mechanical Systems Engineer, Building Services Consultant, and Senior Lecturer in Mechanical and Building Engineering for Module: Mechanical Systems (013621 / 101MS3), Diploma (Conversion) in Facilities Management.
Course Owner: David Teo, tsh52@np.edu.sg. Venue: MS Teams, 6:30 pm - 9:30 pm (campus sessions at Blk 34 #03-02).

## Core Persona & Tone
- Explain mechanical and building services concepts clearly, practically, and intuitively without unnecessary academic jargon.
- Tone is encouraging, educational, gamified, and engaging. Award virtual points and "Engineer Badges" when students answer quizzes or solve problems correctly!
- If a student struggles with a question, offer helpful hints rather than immediately giving away the entire answer.
- Local/Singlish analogies: Provide intuitive Singapore building facilities context (e.g. "Hawker centre kitchen exhaust", "HDB potable water tanks", "Woodlands/Jurong data centres", "Marina Bay district cooling").

## Mandatory COSTAR Formatting Framework
Whenever answering an instructional or conceptual question, structure your response using the COSTAR framework:
- **Content:** The specific mechanical system or topic being addressed (e.g. Sanitary Plumbing, Water-Cooled Chillers, MV SS 553, Fire Code 2023, Town Gas SS 608).
- **Objective:** What the student/operator needs to achieve or understand.
- **Structure:** Step-by-step logic, comparative tables, formula with substitutions, or bullet points.
- **Target:** Adult learners, polytechnic students, facilities managers, building engineers.
- **Audience:** Clear, practical, intuitive language.
- **Relevant:** Tie back directly to real building services, plant operations, and Singapore standards (SS 553, SS 636, SS 608, SS 578, Fire Code 2023, Green Mark GM 2021).

## Exact Knowledge Base & Numerical Values (Use verbatim):
1. Chilled Water & HVAC:
   - Chilled water 5°C - 12°C (below dewpoint -> insulate). Centrifugal pumps 1450 rpm. Expansion tank for expansion + make-up.
   - Circuits: direct return, reverse return, ring loop; constant flow (3-way valves), variable flow (2-way valves + bypass), primary/secondary.
   - Cooling tower make-up: evaporation ≈ 1% per 7°C range; drift/windage ≈ 0.2%; bleed-off ≈ 0.3%.
   - Capacity: E = ṁ × Cp × ΔT (Cp = 4.18 kJ/kg·°C). 1 RT = 3.517 kW. kW/RT = input kW ÷ output RT; COP = output kW ÷ input kW.
   - Code for Environmental Sustainability plant limits: water-cooled ≤ 0.85 kW/RT (new), ≤ 0.90 kW/RT (existing); air-cooled ≤ 1.0 kW/RT.
   - SS 553 pump power limits: CHW < 349 kW/(m³/s) ≈ 0.0528 kW/RT; CW < 301 kW/(m³/s) ≈ 0.057 kW/RT.
   - CHWST reset 6.7°C -> 10°C improves efficiency; lowering CWST raises COP.
   - Affinity laws: P₂ = P₁(N₂/N₁)³ -> 80% speed = 0.512 P₁ (48.8% power reduction).
   - Green Mark GM 2021 part-load pump ratio = 0.0205x + 0.4101x² + 0.5753x³ (x=0.74 -> 0.473, 70 kW -> ~33 kW).
   - Cooling tower fan power ratio = 0.331629 - 0.885676x + 0.605565x² + 0.948482x³ (x=0.74 -> 0.393, 60 kW -> ~24 kW).
   - Cooling tower efficiency (SS 530) = max flow ÷ fan motor nameplate; 3.23 kg/s × 4.18 × 5.6 K = 75.6 kW ≈ 21.5 RT -> 0.0465 kW/RT. EC fans ≈ 30% more efficient.
   - Chiller starting sequence: 1. Cooling towers -> 2. CWP -> 3. AHU -> 4. CHWP -> 5. Water chiller (reverse for shutdown).
   - Chiller surge: reverse flow from condenser to compressor at low load/high lift; prevent via hot gas bypass or raising CHW supply temp.

2. Mechanical Ventilation (SS 553 : 2016):
   - Minimum ACH: offices 6, restaurants/canteens 10, shops 6, workshops/factories 6, classrooms 8, car parks 6, toilets 10, lobbies/corridors/staircases 4, kitchens 20 (may drop to 10 when hood off).
   - Ceiling > 2.5m -> calculate on 2.5m height! Lobbies < 10 m² exempt.
   - Basement car park: 6 ACH, negative pressure, ≥ 50% exhaust at low level ≤ 650 mm from finished floor.
   - Kitchen: ≥ 20 ACH, bifurcated fans, NO fire dampers in kitchen exhaust ducts!
   - Staircase pressurisation: 50 Pa to 60 Pa, air velocity 1.0 m/s across open doors, door opening force Ft = Fc + Fp ≤ 110 N.

3. Sanitary Plumbing & Drainage (SS 636 / PUB DTSS):
   - Plumbing = above ground, drainage = underground. DTSS gravity conveyance to coastal WRPs.
   - Traps: Integral (WC, urinal), P-trap, S-trap (P preferred over S), Bottle trap (basins/sinks). Water seal 25 mm.
   - 5 causes of water seal loss: evaporation, induced siphonage, compression, high winds, capillary action.
   - 1st storey appliances: connected directly to underground drainage, NOT to vertical discharge stack (high compression risk).
   - Systems: single stack (up to 4 storeys 100mm, up to 6 storeys 150mm), ventilated stack, fully ventilated.
   - Drain gradient velocity: 0.9 m/s to 2.4 m/s (avoid scouring). ICs spacing ≤ 50m.

4. Water Supply (SS 636 : 2018):
   - Mode 1 (< 25m MSL / < 125 RL): direct mains supply.
   - Mode 2 (25 - 37m MSL / 125 - 137 RL): indirect high level storage tank (24h storage).
   - Mode 3 (> 37m MSL / > 137 RL): indirect low + high level tanks with duplicate transfer pumps (low tank 1/5 daily for 25-30m MSL, 1/3 for > 30m MSL).
   - High-rise pressure: limit appliance head to ≤ 35m of water via PRVs (SS 636 Cl 6.7).
   - Potable storage litres/occupant: dwellings 150, hostels 90, hotels 135, offices no canteen 35, offices with canteen 45, schools 15.
   - Cistern > 4500L: two compartments, separate overflow & warning pipe (warning below overflow), mosquito netting ≤ 0.65mm, non-duplicable keys.
   - Private meters: non-domestic ≥ 5,000 m³/month, government ≥ 3,000 m³/month. Dedicated NEWater pipework (purple/lilac).

5. Town Gas Supply (Gas Act Cap 116A, SS 608: 2015):
   - Manufactured from naphtha. SG 0.5-0.59 (lighter than air, rises). CV = 18.63 MJ/m³. 1 m³ gas needs 4.5 m³ air for complete combustion.
   - Flammability limits: 3% to 55%. CO content 2-6% (toxic).
   - Commercial kitchen: gas solenoid valve MUST be electrically interlocked with mechanical exhaust fan!
   - Pressure testing: 300 mm water gauge for 2 mins stabilise, 10 mins no pressure drop. Soundness test every 3 years.
   - Prohibited in electrical rooms, switchgear/telecom/transformer/generator ducts, protected lobbies/fire escape routes. Painted yellow.

6. Fire Protection & Fire Code 2023:
   - Extinguishers (SS 578): 15m travel distance rule for Class A; 1 unit of A covers 15 m²; PASS method.
   - Hose reels: 36m coverage (30m hose + 6m throw), 0.4 L/s at 2 bar (6mm) or 6 bar (4mm), max 12 bar, suction tank ≥ 1100 L.
   - Rising mains: Dry rising (10m - 60m), Wet rising (> 60m). Landing valves 38m travel, max 930 m², static pressure < 7 bar.
   - Sprinklers (CP 52): wet, dry, pre-action (smoke detector AND sprinkler), deluge. Water storage tables and densities.

7. Course Administration & Submissions:
   - Practical 1 (Week 5, 16 Nov 2026, Blk 34 #03-02): Word soft copy to BrightSpace, naming: Pract No._Class Group_Register No._Full name.
   - Practical 2 (Week 12, 18 Jan 2027, Blk 34 #03-02): PDF soft copy.
   - Assessment weightage: ASG 40%, CT 20%, WTEST 20%, CLWK 20%.`;

// AI Chatbot endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], singlishMode = false } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const currentInstruction = singlishMode
      ? `${SYSTEM_INSTRUCTION}\n\nNOTE: The student requested Singapore local/practical analogies mode! Feel free to use authentic Singaporean building services expressions, local examples (HDB, hawker centre, Singlish flavor like "lah", "shiok", "confirm compliant"), while keeping technical numbers and standards 100% rigorous!`
      : SYSTEM_INSTRUCTION;

    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          systemInstruction: currentInstruction,
        },
      });

      return res.json({ reply: response.text });
    }

    // Grounded knowledge fallback if API key is not configured
    const lower = message.toLowerCase();
    let fallbackReply = '';

    if (lower.includes('affinity') || lower.includes('pump speed') || lower.includes('48.8%') || lower.includes('pump power')) {
      fallbackReply = `### [COSTAR Analysis] Fan & Pump Affinity Laws

**Content:** Centrifugal Pump & Fan Speed Modulation (Affinity Laws)
**Objective:** Understand how Variable Speed Drives (VSD) achieve dramatic energy savings by modulating impeller speed.

**Structure:**
1. **The Cubic Affinity Law Formula:**
   $$\\frac{P_2}{P_1} = \\left(\\frac{N_2}{N_1}\\right)^3$$
   where $P$ is power (kW) and $N$ is impeller speed (rpm).

2. **Step-by-step 20% Speed Reduction Calculation:**
   - Full speed ratio: $N_1 = 100\\% = 1.0$
   - Reduced speed: $N_2 = 80\\% = 0.8$
   - Power ratio: $P_2 = P_1 \\times (0.8 / 1.0)^3 = 0.512 \\times P_1$
   - Power reduction: $(1 - 0.512) \\times 100\\% = \\mathbf{48.8\\%\\text{ energy saved!}}$

3. **Green Mark (GM 2021) Part-Load Pump Polynomial:**
   When factoring in real motor and VSD inverter losses, Green Mark 2021 provides the exact ratio formula:
   $$\\text{Pump Power Ratio} = 0.0205x + 0.4101x^2 + 0.5753x^3$$
   At $80\\%$ load ($x = 0.8$):
   $$\\text{Ratio} = 0.0205(0.8) + 0.4101(0.64) + 0.5753(0.512) = 0.5775$$
   *(Result: $\\approx 42.2\\%$ net power reduction on a real installed pump system!)*

**Target:** Facilities managers & student engineers preparing for chiller plant retrofits.
**Audience:** Practical engineering terms; a small reduction in flow delivers massive electricity savings!
**Relevant:** Standard practice in Singapore Green Mark buildings to replace throttling valves with VSDs.

⭐ **Engineer Points Awarded:** +50 XP! You've mastered Pump Affinity Laws!`;
    } else if (lower.includes('kitchen') && (lower.includes('damper') || lower.includes('fire damper') || lower.includes('exhaust'))) {
      fallbackReply = `### [COSTAR Analysis] Commercial Kitchen Exhaust Fire Safety

**Content:** Kitchen Mechanical Ventilation & Fire Damper Prohibition (SS 553 : 2016)
**Objective:** Understand why fire dampers are strictly banned in kitchen grease exhaust ducts and how fire safety is maintained.

**Structure:**
1. **The Strict Prohibition:**
   Under SS 553 : 2016 and Fire Code 2023, **NO fire dampers are permitted** inside commercial kitchen exhaust ducts.

2. **Technical Rationale:**
   - Kitchen exhaust carries hot cooking grease and oil vapor in aerosol suspension.
   - Grease rapidly deposits on damper blades, pivots, and fusible links.
   - If a fire damper is installed, grease buildup will cause the damper to stick or accidentally drop closed during high-heat cooking, choking the exhaust.
   - More dangerously, in a real grease fire, a fusible link might fail to trip, or the intense grease fire would burn through the thin damper assembly, spreading fire into false ceilings!

3. **Compliant Alternative Fire Safety Measures:**
   - **Fire-Rated Duct Construction:** Ducts must be constructed of minimum 1.2mm galvanized steel or stainless steel, wrapped in 1-hour or 2-hour fire-rated insulation board (rockwool).
   - **Bifurcated Exhaust Fans:** Fan motor is isolated in a separate middle tunnel bathed in cool outdoor ambient air, never coming into contact with the grease stream.
   - **Kitchen Gas Solenoid Interlock:** Gas solenoid valve must be electrically interlocked to cut off town gas fuel immediately if the mechanical exhaust fan stops running!
   - **Minimum Ventilation Rate:** Kitchen exhaust must maintain $\\ge 20\\text{ ACH}$ (can reduce to $10\\text{ ACH}$ only when the hood is off).

**Target:** F&B building managers, MEP consultants, and safety inspectors.
**Audience:** Straightforward: grease will jam the damper; build a fire-rated duct with bifurcated fans instead!
**Relevant:** Inspected by SCDF during Registered Inspector (RI) fire certificate sign-off.

⭐ **Engineer Points Awarded:** +50 XP! Fire Safety Specialist Badge earned!`;
    } else if (lower.includes('start') && lower.includes('sequence') || lower.includes('chiller sequence')) {
      fallbackReply = `### [COSTAR Analysis] Water-Cooled Chiller Plant Starting & Shutdown Sequence

**Content:** Central Water-Cooled Chiller Plant Operations
**Objective:** Understand the 5-step interlocking sequence to start and stop a chiller safely without triggering freeze or surge trips.

**Structure:**
1. **Starting Sequence (Interlocked Step-by-Step):**
   - **Step 1: Start Cooling Tower(s)** (Ensure basin water is circulating and fan is ready to reject heat).
   - **Step 2: Start Condenser Water Pump (CWP)** (Establish cooling water flow through the chiller's condenser; condenser flow switch closes).
   - **Step 3: Start Air Handling Unit(s) (AHU / FCU)** (Establish building heat load across cooling coils).
   - **Step 4: Start Chilled Water Pump (CHWP)** (Circulate water through the evaporator cooler; chilled water flow switch closes).
   - **Step 5: Start Water Chiller Compressor** (Compressor starts only after both CWP and CHWP flow switches confirm normal water flow!).

2. **Shutting Down Sequence:**
   - Strictly the **reverse** of the starting sequence:
   1. Stop Water Chiller(s)
   2. Stop Chilled Water Pump(s)
   3. Stop Air Handling Unit(s)
   4. Stop Condenser Water Pump(s)
   5. Stop Cooling Tower(s)

3. **Why Interlocks Matter:**
   If the chiller starts before CHWP is running, water in the evaporator tubes will rapidly freeze, causing shell-and-tube rupture! The anti-freeze cut-out and water flow switches prevent this disaster.

**Target:** Plant operators, BMS engineers, and diploma candidates.
**Audience:** Logical flow: heat sink first (towers/CWP), distribution second (AHU/CHWP), compressor last!
**Relevant:** Standard BMS logic and SCDF/BCA equipment operating procedures.

⭐ **Engineer Points Awarded:** +50 XP! Certified Plant Operator Badge earned!`;
    } else {
      fallbackReply = `### [COSTAR Response] MechApp Studio AI — Mechanical Systems Guidance

**Content:** Module 013621 / 101MS3 (Diploma in Facilities Management)
**Objective:** Clarify commercial building mechanical systems concepts and practical engineering formulas.

**Structure:**
1. **Key Governing Standards:**
   - **HVAC & Chiller Plants:** SS 530 (IPLV/FL efficiency), SS 553 (pump limits: CHW $< 0.0528$ kW/RT, CW $< 0.057$ kW/RT), Code for Environmental Sustainability (new $\\le 0.85$ kW/RT, existing $\\le 0.90$ kW/RT).
   - **Mechanical Ventilation:** SS 553 : 2016 (Offices 6 ACH, Toilets 10 ACH, Car park 6 ACH with 50% low-level exhaust $\\le 650$ mm, Kitchen 20 ACH).
   - **Sanitary & Water Supply:** SS 636 : 2018 (Mode 1: $< 25$m MSL; Mode 2: $25-37$m MSL; Mode 3: $> 37$m MSL; PRV appliance limit $\\le 35$m head; Cistern $> 4500$L two compartments).
   - **Fire Safety:** Fire Code 2023 (Staircase pressurisation $50-60$ Pa, door force $\\le 110$ N, door velocity $1.0$ m/s; SS 578 extinguishers).
   - **Town Gas:** SS 608 : 2015 (Naphtha gas, SG $0.5-0.59$, CV $18.63$ MJ/m³, 4.5 m³ air/m³ gas, kitchen solenoid fan interlock).

2. **Try out the Interactive Challenges:**
   - Click the **"Chiller Challenge"** tab to optimize kW/RT without causing surge!
   - Try the **"Trap Fault Mystery"** to diagnose water seal loss (Evaporation, Siphonage, Compression, High Winds, Capillary Action).
   - Or test any calculation formula with step-by-step working!

**Target:** FM Diploma students & practicing engineers.
**Audience:** Practical and intuitive building services engineering.
**Relevant:** Real Singapore commercial buildings and polytechnic curriculum.`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: error.message || 'Server error processing request' });
  }
});

// In development, mount Vite middleware; in production, serve built static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MechApp Studio AI server running on http://localhost:${PORT}`);
  });
}

startServer();
