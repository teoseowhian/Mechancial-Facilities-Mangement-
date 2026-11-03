# Google AI Studio prompt: Mechanical Systems class app

Paste everything below the line into the Google AI Studio Build chat.

---

Build a single-page, mobile-first web app (React + Tailwind) that works as the landing page for my module **Mechanical Systems (101MS3)** in the **Diploma (Conversion) in Facilities Management, Oct 2026 semester**. The look should copy a clean academic course poster: white background, one strong accent colour, bold sans-serif headings, generous white space and thin divider rules. It must look good on a phone first (most students open it from a QR code) and still look tidy on a laptop.

## Config (one object at the top of the code)
Put every name, colour, date and link in ONE config object at the top so I can edit them in one place:
- institution: "Ngee Ann Polytechnic" (text only, no official logo)
- course: "Diploma (Conversion) in Facilities Management"
- moduleName: "Mechanical Systems", moduleId: "013621 / 101MS3", semester: "Oct 2026"
- classTime: "Mondays, 6:30 pm – 9:30 pm (MS Teams unless stated)"
- lecturer: "David Teo", email: "tsh52@np.edu.sg"
- lmsUrl: "https://lms.polite.edu.sg/d2l/home/1023236"
- recordingsUrl: "" (empty for now)
- accent: "#C8102E" (placeholder red), text "#1A1A1A", muted "#6B6B6B", border "#E5E5E5"

## Layout, top to bottom

1. **Thin accent bar** (6px) across the very top.

2. **Header**
   - Eyebrow line in accent colour, uppercase, letter-spaced: "DCFM · MECHANICAL SYSTEMS · OCT 2026"
   - Big bold title: "Mechanical Systems"
   - Subtitle: "Fifteen weeks on the mechanical services inside buildings: fire protection, water, sanitary plumbing, ventilation, town gas and air-conditioning. Module 101MS3, Diploma (Conversion) in Facilities Management."
   - A small info row: class time, lecturer, and a "Go to LMS" button (opens lmsUrl in a new tab).
   - A "This week" banner: work out the current week from today's date and the schedule below, and show "Week N · [topic] · [date] · [venue]". Before week 1 show "Starts 19 Oct 2026"; during the vacation show "Vacation break, classes resume 4 Jan 2027"; after week 15 show "Semester ended".
   - A dark horizontal rule below.

3. **Week cards** (one row per week, separated by thin grey rules). Each row has two parts:
   - **Left: a "slide thumbnail" card** with a red top border, small "NGEE ANN POLYTECHNIC" text in small caps, an accent kicker "MECHANICAL SYSTEMS", the short topic title in bold, a simple line illustration in inline SVG (black lines with accent highlights, no photos), a red badge top-right "W1"…"W15", and a tiny footer "101MS3 · Week N".
   - **Right: text** with "Week N · date" in accent colour, a two-line bold headline, the venue (show an "On campus" pill for Blk 34 sessions, "Online" pill for MS Teams), and a muted list of what is covered.
   - Highlight the current week's card with an accent outline; fade past weeks slightly.
   - On a phone, stack the thumbnail above the text. On wide screens, side by side.
   - Tapping a card expands it to show the tutorial questions (if any) and buttons for "Lecture notes", "Tutorial", "Answer key" and "Recording". URLs come from the week's data; an empty URL shows a greyed-out "Coming soon" button.
   - Practical and test weeks use a different illustration (a hard hat / a clipboard with a tick) and no tutorial buttons.
   - Insert a full-width grey divider between week 9 and week 10: "Vacation break · 21 Dec 2026 – 3 Jan 2027".

   Store the weeks as a data array in the config. The schedule:

   | Week | Date | Venue | Topic |
   |---|---|---|---|
   | 1 | Mon 19 Oct 2026 | MS Teams | Fire Protection Systems 1 & 2 |
   | 2 | Mon 26 Oct 2026 | MS Teams | Water Circuits |
   | 3 | Mon 2 Nov 2026 | MS Teams | Water Supply Systems |
   | 4 | Wed 11 Nov 2026 | MS Teams | Sanitary Plumbing & Drainage Systems |
   | 5 | Mon 16 Nov 2026 | Blk 34 #03-02 | Practical 1 (in school), with Supandi |
   | 6 | Mon 23 Nov 2026 | MS Teams | Mechanical Drawings |
   | 7 | Mon 30 Nov 2026 | MS Teams | Mechanical Ventilation Systems |
   | 8 | Mon 7 Dec 2026 | MS Teams | Town Gas, and Revision |
   | 9 | Mon 14 Dec 2026 | Blk 34 #03-02 | Common Test 1 (on campus) |
   | – | 21 Dec 2026 – 3 Jan 2027 | – | Vacation break |
   | 10 | Mon 4 Jan 2027 | MS Teams | Air-conditioning 1 |
   | 11 | Mon 11 Jan 2027 | MS Teams | Air-conditioning 2 |
   | 12 | Mon 18 Jan 2027 | Blk 34 #03-02 | Air-conditioning Systems (Practical), with Supandi |
   | 13 | Mon 25 Jan 2027 | MS Teams | Air Systems |
   | 14 | Mon 1 Feb 2027 | MS Teams | Chiller Plant Efficiency, and Revision |
   | 15 | Wed 10 Feb 2027 | Blk 34 #03-02 | Test 2 (on campus). CNY break 5–8 Feb 2027 |

   Card content and illustrations:

   - **W1 Fire Protection Systems** · Headline "Detect, alarm and suppress" · Illustration: sprinkler head spraying, with a hose reel. Covered: fire protection systems parts 1 and 2.
   - **W2 Water Circuits** · Headline "How water moves through a building" · Illustration: a closed loop with a pump and flow arrows.
   - **W3 Water Supply Systems** · Headline "From the four national taps to the building tap" · Illustration: high-rise outline with roof tank, ground pump and riser with branches. Covered: Four National Taps, direct/indirect supply modes, pressure reduction in high-rise, single vs multi-stage pumping, metering, storage tanks, pipe materials, WELS. Tutorial questions: 1 System overview · 2 Water supply modes · 3 Pressure management · 4 Pump operation · 5 Water metering · 6 Storage tank design · 7 Pipe materials · 8 Regulations and fittings (WELS).
   - **W4 Sanitary Plumbing & Drainage** · Headline "Where the waste water goes" · Illustration: soil stack with a P-trap, vent through the roof, sloping drain to an inspection chamber. Covered: plumbing vs drainage, appliances, traps, stack systems, uPVC vs cast iron, inspection chambers, grease traps, drain line design, sump pumps and ejectors. Tutorial questions: 1 Plumbing vs drainage · 2 Sanitary appliances · 3 System components · 4 Traps · 5 Stack systems · 6 uPVC vs cast iron · 7 Inspection chambers · 8 Grease traps · 9 Drain line design · 10 Sump pumps and sewage ejectors.
   - **W5 Practical 1** · Headline "Hands-on in the lab" · hard-hat illustration.
   - **W6 Mechanical Drawings** · Headline "Reading M&E drawings" · Illustration: a floor-plan grid with a duct run and a section mark.
   - **W7 Mechanical Ventilation** · Headline "Moving air in and out" · Illustration: a fan with a duct and airflow arrows.
   - **W8 Town Gas & Revision** · Headline "Safe gas from the main to the burner" · Illustration: gas meter, isolating valve and pipe run to a burner with a small accent flame. Covered: composition and properties, complete combustion, commercial kitchen piping, routing, purging and charging-in, annual inspection, soundness and pressure tests, corrosion protection. Tutorial questions: 1 Composition · 2 Characteristics (SG, CV, flammability) · 3 Complete combustion · 4 Kitchen piping components · 5 Pipe routing · 6 Purging and charging-in · 7 Annual inspection · 8 Soundness test · 9 Pressure test · 10 Corrosion protection.
   - **W9 Common Test 1** · Headline "Test on campus" · clipboard illustration.
   - **W10 Air-conditioning 1** and **W11 Air-conditioning 2** · Headlines "Cooling basics" and "AC systems in buildings" · Illustration: split unit / AHU with a cold-air arrow.
   - **W12 AC Systems Practical** · Headline "Hands-on with AC systems" · hard-hat illustration.
   - **W13 Air Systems** · Headline "Ducts, fans and air distribution" · Illustration: duct branch with diffusers.
   - **W14 Chiller Plant Efficiency & Revision** · Headline "Getting more cooling per kW" · Illustration: chiller with a cooling tower and a small gauge.
   - **W15 Test 2** · Headline "Test on campus" · clipboard illustration.

4. **Assessment weightage** (small section below the cards): four tiles showing Common Test 20%, Written Test 20%, Assignment 40%, Class Work 20% (all individual), with a thin bar for each percentage in the accent colour. Under it, a muted note: "Schedule may change. Always check the LMS for updates."

5. **Footer** (dark rule above it):
   - Left: a square QR code block in the accent colour with a white rounded inner area and a label "101MS3" underneath. Generate the QR code client-side from lmsUrl (use a small library such as `qrcode.react`).
   - Right:
     - Bold line: "Scan for the module page and all recordings"
     - Accent link: "Mechanical Systems on LMS" → lmsUrl (new tab)
     - Muted line: recordings link if recordingsUrl is set, otherwise "Recordings: coming soon"
     - Small muted line: "David Teo · tsh52@np.edu.sg · Ngee Ann Polytechnic · DCFM"

## Behaviour and quality
- No login, no backend, no database. Static content only.
- Accessible: real links and buttons, aria-labels on the SVG illustrations, good colour contrast, keyboard focus styles.
- Use a clean font such as Lato or Inter from Google Fonts.
- Subtle polish only: light shadow on thumbnail cards, gentle hover lift on desktop, smooth expand/collapse. No heavy animation.
- Add a "Print / Save as poster" button in the header that prints the page as an A4 portrait poster (hide buttons, banner and detail panels in print; keep header, week cards, weightage and footer).
