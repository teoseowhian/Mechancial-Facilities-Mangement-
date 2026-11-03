/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WeekData } from '../data/courseConfig';

interface PosterThumbnailIllustrationProps {
  type: WeekData['illustrationType'];
  accent?: string;
  className?: string;
}

export const PosterThumbnailIllustration: React.FC<PosterThumbnailIllustrationProps> = ({
  type,
  accent = '#C8102E',
  className = 'w-full h-full'
}) => {
  switch (type) {
    case 'sprinkler':
      // W1: Sprinkler head spraying with hose reel
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Fire sprinkler head and hose reel"
        >
          {/* Supply pipe */}
          <line x1="20" y1="18" x2="90" y2="18" stroke="#1A1A1A" strokeWidth="2.5" />
          <line x1="60" y1="18" x2="60" y2="35" stroke="#1A1A1A" strokeWidth="2.5" />
          
          {/* Sprinkler frame & red bulb */}
          <path d="M 50 35 L 70 35 L 68 52 L 60 62 L 52 52 Z" stroke="#1A1A1A" strokeWidth="1.8" />
          {/* Glass bulb filled with accent red */}
          <rect x="58" y="40" width="4" height="12" rx="2" fill={accent} stroke={accent} strokeWidth="1" />
          {/* Deflector plate */}
          <path d="M 46 62 Q 60 68 74 62" stroke="#1A1A1A" strokeWidth="2.2" />
          <line x1="48" y1="63" x2="45" y2="67" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="56" y1="65" x2="54" y2="70" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="64" y1="65" x2="66" y2="70" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="72" y1="63" x2="75" y2="67" stroke="#1A1A1A" strokeWidth="1.5" />

          {/* Water spray arcs in accent */}
          <path d="M 38 72 A 30 30 0 0 0 82 72" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 30 84 A 45 45 0 0 0 90 84" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 24 96 A 60 60 0 0 0 96 96" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Hose reel on the right */}
          <circle cx="126" cy="48" r="22" stroke="#1A1A1A" strokeWidth="2" />
          <circle cx="126" cy="48" r="14" stroke={accent} strokeWidth="1.5" />
          <circle cx="126" cy="48" r="4" fill="#1A1A1A" />
          {/* Hose nozzle & coiled path */}
          <path d="M 126 70 C 126 85, 115 90, 108 92" stroke="#1A1A1A" strokeWidth="2" />
          <line x1="108" y1="92" x2="100" y2="92" stroke={accent} strokeWidth="3" />
        </svg>
      );

    case 'loop':
      // W2: Closed hydronic loop with pump and flow arrows
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Closed hydronic water circuit with pump"
        >
          {/* Rounded loop path */}
          <rect x="22" y="20" width="116" height="70" rx="14" stroke="#1A1A1A" strokeWidth="2.5" />
          
          {/* Centrifugal pump at bottom loop */}
          <circle cx="65" cy="90" r="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
          <circle cx="65" cy="90" r="5" fill={accent} stroke={accent} />
          <path d="M 65 78 L 77 90 L 65 102" stroke="#1A1A1A" strokeWidth="1.5" />

          {/* Heat exchanger / coil at top loop */}
          <rect x="85" y="14" width="36" height="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
          <line x1="94" y1="14" x2="94" y2="26" stroke={accent} strokeWidth="1.5" />
          <line x1="103" y1="14" x2="103" y2="26" stroke={accent} strokeWidth="1.5" />
          <line x1="112" y1="14" x2="112" y2="26" stroke={accent} strokeWidth="1.5" />

          {/* Flow arrows along loop */}
          <path d="M 45 20 L 53 16 M 45 20 L 53 24" stroke={accent} strokeWidth="2" />
          <path d="M 138 52 L 142 60 M 138 52 L 134 60" stroke={accent} strokeWidth="2" />
          <path d="M 115 90 L 107 86 M 115 90 L 107 94" stroke={accent} strokeWidth="2" />
          <path d="M 22 58 L 18 50 M 22 58 L 26 50" stroke={accent} strokeWidth="2" />

          {/* Decoupler bypass line in middle */}
          <line x1="80" y1="20" x2="80" y2="90" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="83" y="58" fill={accent} fontSize="8" fontWeight="700" fontFamily="sans-serif">ΔP=0</text>
        </svg>
      );

    case 'riser':
      // W3: High-rise outline with roof tank, ground pump and riser with branches
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="High-rise building with water supply riser and roof tank"
        >
          {/* Building outline */}
          <rect x="35" y="26" width="90" height="74" stroke="#1A1A1A" strokeWidth="2" fill="#FAFAFA" />
          {/* Floor slab lines */}
          <line x1="35" y1="44" x2="125" y2="44" stroke="#E5E5E5" strokeWidth="1.5" />
          <line x1="35" y1="62" x2="125" y2="62" stroke="#E5E5E5" strokeWidth="1.5" />
          <line x1="35" y1="80" x2="125" y2="80" stroke="#E5E5E5" strokeWidth="1.5" />

          {/* Roof gravity storage tank */}
          <rect x="80" y="10" width="34" height="16" rx="2" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
          {/* Water level in tank */}
          <line x1="84" y1="18" x2="110" y2="18" stroke={accent} strokeWidth="2" strokeDasharray="2 2" />
          {/* Tank dual compartment divider */}
          <line x1="97" y1="10" x2="97" y2="26" stroke="#1A1A1A" strokeWidth="1.5" />

          {/* Supply riser pipe */}
          <line x1="52" y1="100" x2="52" y2="26" stroke="#1A1A1A" strokeWidth="2.5" />
          <line x1="52" y1="26" x2="80" y2="26" stroke="#1A1A1A" strokeWidth="2.5" />

          {/* Floor branch lines with PRVs in accent */}
          <line x1="52" y1="36" x2="72" y2="36" stroke="#1A1A1A" strokeWidth="1.5" />
          <circle cx="65" cy="36" r="3" fill={accent} stroke={accent} />
          
          <line x1="52" y1="54" x2="72" y2="54" stroke="#1A1A1A" strokeWidth="1.5" />
          <circle cx="65" cy="54" r="3" fill={accent} stroke={accent} />

          <line x1="52" y1="72" x2="72" y2="72" stroke="#1A1A1A" strokeWidth="1.5" />
          <circle cx="65" cy="72" r="3" fill={accent} stroke={accent} />

          {/* Ground booster pump */}
          <circle cx="52" cy="94" r="6" fill="#FFFFFF" stroke={accent} strokeWidth="2" />
          <path d="M 22 94 L 46 94" stroke="#1A1A1A" strokeWidth="2" />
          <text x="14" y="96" fill="#6B6B6B" fontSize="7" fontWeight="600" fontFamily="sans-serif">PUB</text>
        </svg>
      );

    case 'stack':
      // W4: Soil stack with P-trap, roof vent, sloping drain to inspection chamber
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Sanitary soil stack, P-trap and inspection chamber"
        >
          {/* Ground & roof lines */}
          <line x1="20" y1="20" x2="90" y2="20" stroke="#E5E5E5" strokeWidth="2" />
          <line x1="20" y1="85" x2="145" y2="85" stroke="#1A1A1A" strokeWidth="2" />

          {/* Vertical Soil Discharge Stack (extends above roof as vent cowl) */}
          <line x1="55" y1="10" x2="55" y2="85" stroke="#1A1A1A" strokeWidth="2.5" />
          {/* Vent cowl on top */}
          <path d="M 48 10 C 48 6, 62 6, 62 10" stroke="#1A1A1A" strokeWidth="2" />
          <text x="60" y="14" fill="#6B6B6B" fontSize="6" fontFamily="sans-serif">VENT</text>

          {/* Water closet / basin branch with P-trap with accent water seal */}
          <path d="M 95 38 L 80 38 C 76 38, 74 46, 70 46 C 66 46, 64 38, 55 38" stroke="#1A1A1A" strokeWidth="2" />
          {/* Water seal inside P-trap in accent */}
          <path d="M 74 46 C 70 46, 68 41, 66 41" stroke={accent} strokeWidth="3" />

          {/* Second fixture branch */}
          <path d="M 95 62 L 78 62 C 74 62, 72 70, 68 70 C 64 70, 62 62, 55 62" stroke="#1A1A1A" strokeWidth="2" />
          <path d="M 72 70 C 68 70, 66 65, 64 65" stroke={accent} strokeWidth="3" />

          {/* Large radius bend at base of stack */}
          <path d="M 55 85 Q 55 95 68 95 L 115 97" stroke="#1A1A1A" strokeWidth="2.5" />

          {/* Sloping drain to Inspection Chamber (IC) */}
          <rect x="115" y="82" width="26" height="22" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          <line x1="115" y1="82" x2="141" y2="82" stroke={accent} strokeWidth="2" />
          <line x1="115" y1="97" x2="141" y2="99" stroke="#1A1A1A" strokeWidth="2" />
          <text x="122" y="93" fill={accent} fontSize="8" fontWeight="800" fontFamily="sans-serif">IC</text>
        </svg>
      );

    case 'hardhat':
      // W5 & W12: Practical in-lab hard hat
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Safety hard hat for laboratory practicals"
        >
          {/* Hard hat dome */}
          <path
            d="M 40 68 C 40 34, 120 34, 120 68 Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="2.5"
          />
          {/* Hat brim */}
          <path
            d="M 30 68 C 30 64, 130 64, 130 68 C 130 74, 30 74, 30 68 Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="2.5"
          />
          {/* Top safety ridge / rib */}
          <path d="M 72 37 C 76 34, 84 34, 88 37 L 88 64 L 72 64 Z" stroke="#1A1A1A" strokeWidth="1.5" />
          
          {/* NP / DCFM red safety badge on front */}
          <rect x="73" y="46" width="14" height="12" rx="2" fill={accent} stroke={accent} />
          <line x1="80" y1="49" x2="80" y2="55" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="77" y1="52" x2="83" y2="52" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Practical tools: calipers / wrench underneath */}
          <path d="M 45 88 L 68 88 M 52 83 L 52 93" stroke="#6B6B6B" strokeWidth="1.5" />
          <path d="M 92 88 L 115 88 M 108 83 L 108 93" stroke="#6B6B6B" strokeWidth="1.5" />
          <circle cx="80" cy="88" r="4" fill="none" stroke={accent} strokeWidth="1.5" />
        </svg>
      );

    case 'grid':
      // W6: Mechanical Drawings floor-plan grid with duct run & section mark
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Mechanical drawings floor plan grid with ductwork and section mark"
        >
          {/* Grid lines */}
          <line x1="25" y1="25" x2="135" y2="25" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="25" y1="55" x2="135" y2="55" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="25" y1="85" x2="135" y2="85" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="45" y1="15" x2="45" y2="95" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="80" y1="15" x2="80" y2="95" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="115" y1="15" x2="115" y2="95" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="3 3" />

          {/* Main double-line duct run */}
          <rect x="35" y="44" width="75" height="18" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          {/* Branch duct tapering off */}
          <path d="M 85 44 L 85 24 L 105 24 L 105 44" stroke="#1A1A1A" strokeWidth="1.8" fill="#FFFFFF" />
          <line x1="90" y1="24" x2="100" y2="24" stroke={accent} strokeWidth="2.5" />

          {/* Section line marker A-A in accent */}
          <line x1="60" y1="30" x2="60" y2="76" stroke={accent} strokeWidth="2" strokeDasharray="6 2" />
          <circle cx="60" cy="28" r="6" fill={accent} stroke={accent} />
          <text x="58" y="31" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">A</text>
          <circle cx="60" cy="78" r="6" fill={accent} stroke={accent} />
          <text x="58" y="81" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">A</text>

          {/* Diffuser symbol */}
          <line x1="120" y1="47" x2="132" y2="59" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="120" y1="59" x2="132" y2="47" stroke="#1A1A1A" strokeWidth="1.5" />
          <rect x="117" y="44" width="18" height="18" stroke="#1A1A1A" strokeWidth="1.5" />
        </svg>
      );

    case 'fan':
      // W7: Mechanical Ventilation fan with duct & airflow arrows
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Mechanical ventilation centrifugal fan with ductwork"
        >
          {/* Centrifugal fan scroll casing */}
          <path
            d="M 52 35 C 72 20, 88 38, 88 62 C 88 82, 68 90, 48 85 C 32 80, 24 64, 28 48 C 30 38, 40 32, 52 35 Z"
            stroke="#1A1A1A"
            strokeWidth="2.5"
            fill="#FFFFFF"
          />
          {/* Fan hub & blades */}
          <circle cx="56" cy="60" r="14" stroke="#1A1A1A" strokeWidth="1.5" />
          <circle cx="56" cy="60" r="4" fill={accent} />
          <line x1="56" y1="46" x2="56" y2="52" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="70" y1="60" x2="64" y2="60" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="56" y1="74" x2="56" y2="68" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="42" y1="60" x2="48" y2="60" stroke="#1A1A1A" strokeWidth="1.5" />

          {/* Discharge duct to the right */}
          <path d="M 78 30 L 135 30 L 135 48 L 84 48" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />

          {/* Airflow arrows in accent */}
          <path d="M 98 39 L 118 39 M 112 35 L 118 39 L 112 43" stroke={accent} strokeWidth="2" />
          <path d="M 124 39 L 144 39 M 138 35 L 144 39 L 138 43" stroke={accent} strokeWidth="2" />

          {/* Car park low-level extraction indicator */}
          <line x1="100" y1="78" x2="135" y2="78" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="96" y="90" fill="#6B6B6B" fontSize="7" fontFamily="sans-serif">≤ 650 mm Level</text>
        </svg>
      );

    case 'burner':
      // W8: Gas meter, isolating valve, pipe run to burner with accent flame
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Town gas meter, isolation valve and burner with flame"
        >
          {/* Gas diaphragm meter on left */}
          <rect x="25" y="38" width="30" height="36" rx="4" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          <circle cx="40" cy="54" r="8" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="40" y1="54" x2="44" y2="50" stroke={accent} strokeWidth="1.5" />
          <text x="32" y="68" fill="#6B6B6B" fontSize="6" fontFamily="sans-serif">METER</text>

          {/* Gas pipeline */}
          <line x1="55" y1="46" x2="115" y2="46" stroke="#1A1A1A" strokeWidth="2.5" />

          {/* Solenoid / Isolation Valve */}
          <polygon points="76,40 76,52 86,46" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
          <polygon points="86,40 86,52 76,46" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
          <circle cx="81" cy="46" r="2" fill={accent} />
          <line x1="81" y1="40" x2="81" y2="34" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="77" y1="34" x2="85" y2="34" stroke={accent} strokeWidth="2" />

          {/* Burner head */}
          <path d="M 115 46 L 115 62 L 132 62" stroke="#1A1A1A" strokeWidth="2.5" />
          <rect x="122" y="60" width="22" height="10" rx="2" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          <line x1="126" y1="60" x2="126" y2="58" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="132" y1="60" x2="132" y2="58" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="138" y1="60" x2="138" y2="58" stroke="#1A1A1A" strokeWidth="1.5" />

          {/* Flame in accent red */}
          <path
            d="M 133 56 C 130 50, 128 42, 133 34 C 137 40, 142 46, 137 54 C 136 55, 134 56, 133 56 Z"
            fill={accent}
            stroke={accent}
            strokeWidth="1"
          />
        </svg>
      );

    case 'clipboard':
      // W9 & W15: Test week clipboard with check mark
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Exam assessment clipboard with checkmark"
        >
          {/* Clipboard board */}
          <rect x="48" y="22" width="64" height="74" rx="4" stroke="#1A1A1A" strokeWidth="2.5" fill="#FFFFFF" />
          {/* Metal clip on top */}
          <rect x="66" y="15" width="28" height="12" rx="2" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
          <circle cx="80" cy="20" r="3" fill={accent} stroke={accent} />

          {/* Paper lines */}
          <line x1="60" y1="38" x2="100" y2="38" stroke="#E5E5E5" strokeWidth="2" />
          <line x1="60" y1="48" x2="100" y2="48" stroke="#E5E5E5" strokeWidth="2" />
          <line x1="60" y1="58" x2="90" y2="58" stroke="#E5E5E5" strokeWidth="2" />
          <line x1="60" y1="68" x2="85" y2="68" stroke="#E5E5E5" strokeWidth="2" />

          {/* Big tick in accent color */}
          <path d="M 72 72 L 80 80 L 102 54" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'split_ahu':
      // W10 & W11: Split unit / AHU with cold-air arrow
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Air conditioning indoor unit with cooling coil and airflow"
        >
          {/* Indoor split unit casing */}
          <rect x="30" y="30" width="85" height="38" rx="4" stroke="#1A1A1A" strokeWidth="2.5" fill="#FFFFFF" />
          {/* Supply air louver at bottom */}
          <line x1="38" y1="60" x2="107" y2="60" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="42" y1="64" x2="103" y2="64" stroke="#1A1A1A" strokeWidth="1.5" />
          
          {/* Filter / coil fins inside */}
          <line x1="45" y1="36" x2="45" y2="54" stroke="#E5E5E5" strokeWidth="1.5" />
          <line x1="55" y1="36" x2="55" y2="54" stroke="#E5E5E5" strokeWidth="1.5" />
          <line x1="65" y1="36" x2="65" y2="54" stroke="#E5E5E5" strokeWidth="1.5" />
          <line x1="75" y1="36" x2="75" y2="54" stroke="#E5E5E5" strokeWidth="1.5" />

          {/* Power / Mode LED dot in accent */}
          <circle cx="104" cy="38" r="2.5" fill={accent} />

          {/* Cold air curved discharge arrows */}
          <path d="M 55 70 C 55 82, 65 92, 78 96 M 72 98 L 78 96 L 76 90" stroke={accent} strokeWidth="2" />
          <path d="M 80 70 C 80 84, 95 92, 110 94 M 104 96 L 110 94 L 106 88" stroke={accent} strokeWidth="2" />
          <text x="114" y="96" fill={accent} fontSize="8" fontWeight="bold" fontFamily="sans-serif">24°C</text>
        </svg>
      );

    case 'duct':
      // W13: Duct branch with diffusers
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Air distribution duct branch with swirl diffusers"
        >
          {/* Main rectangular duct run */}
          <rect x="25" y="32" width="75" height="24" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          
          {/* Transition / reducer to smaller section */}
          <path d="M 100 32 L 125 38 L 145 38 L 145 50 L 125 50 L 100 56 Z" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />

          {/* Branch duct drop to diffuser */}
          <rect x="55" y="56" width="16" height="22" stroke="#1A1A1A" strokeWidth="1.5" fill="#FFFFFF" />
          
          {/* Ceiling diffuser at bottom with accent vane highlights */}
          <rect x="47" y="78" width="32" height="6" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          <line x1="53" y1="84" x2="49" y2="92" stroke={accent} strokeWidth="1.8" />
          <line x1="63" y1="84" x2="63" y2="94" stroke={accent} strokeWidth="1.8" />
          <line x1="73" y1="84" x2="77" y2="92" stroke={accent} strokeWidth="1.8" />

          {/* Airflow velocity arrow inside main duct */}
          <path d="M 38 44 L 68 44 M 62 40 L 68 44 L 62 48" stroke={accent} strokeWidth="2" />
        </svg>
      );

    case 'chiller':
      // W14: Chiller with cooling tower and small gauge
      return (
        <svg
          viewBox="0 0 160 110"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Centrifugal water chiller and cooling tower plant"
        >
          {/* Chiller evaporator barrel (bottom) */}
          <rect x="25" y="55" width="60" height="20" rx="10" stroke="#1A1A1A" strokeWidth="2.2" fill="#FFFFFF" />
          {/* Chiller condenser barrel (top) */}
          <rect x="25" y="28" width="60" height="20" rx="10" stroke="#1A1A1A" strokeWidth="2.2" fill="#FFFFFF" />
          {/* Centrifugal compressor in middle with accent highlight */}
          <circle cx="55" cy="44" r="10" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          <circle cx="55" cy="44" r="4" fill={accent} stroke={accent} />

          {/* Pressure / COP Gauge on chiller */}
          <circle cx="34" cy="22" r="7" stroke="#1A1A1A" strokeWidth="1.5" fill="#FFFFFF" />
          <line x1="34" y1="22" x2="38" y2="18" stroke={accent} strokeWidth="1.5" />

          {/* Connecting pipes to cooling tower */}
          <path d="M 85 36 L 105 36 L 105 50 L 115 50" stroke="#1A1A1A" strokeWidth="2" />

          {/* Cooling Tower on right */}
          <path d="M 115 75 L 120 40 L 145 40 L 150 75 Z" stroke="#1A1A1A" strokeWidth="2" fill="#FFFFFF" />
          {/* CT fan on top */}
          <ellipse cx="132" cy="40" rx="12" ry="3" stroke="#1A1A1A" strokeWidth="1.5" />
          <line x1="132" y1="36" x2="132" y2="40" stroke={accent} strokeWidth="2" />
          {/* CT louvers */}
          <line x1="123" y1="58" x2="142" y2="58" stroke="#6B6B6B" strokeWidth="1.5" />
          <line x1="121" y1="66" x2="144" y2="66" stroke="#6B6B6B" strokeWidth="1.5" />

          <text x="26" y="90" fill={accent} fontSize="8" fontWeight="bold" fontFamily="sans-serif">kW/RT ≤ 0.68</text>
        </svg>
      );

    default:
      return null;
  }
};
