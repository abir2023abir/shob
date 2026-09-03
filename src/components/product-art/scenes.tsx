import type { ReactNode } from "react";

/**
 * One drawing per product, keyed by catalogue id.
 *
 * The store ships no photographs — every product image is drawn here as flat
 * SVG so nothing can 404 and the catalogue weighs nothing. Each scene is drawn
 * to look like the thing it sells: the ultrabook is an ultrabook, the saree is
 * a saree. `bg` tints the backdrop to suit the product rather than the whole
 * category, and `art` is the object itself, lit from the top left.
 *
 * Everything lives inside x 60–340, y 70–330 so a 4:3 crop never clips it.
 */
export interface Scene {
  /** Backdrop gradient, light corner first. */
  bg: [string, string];
  art: ReactNode;
}

/** Contact shadow every product sits on. A plain helper, not a component. */
const floor = (rx = 116, cy = 316) => (
  <ellipse cx="200" cy={cy} rx={rx} ry="15" fill="#171425" opacity="0.11" />
);

export const PRODUCT_SCENES: Record<string, Scene> = {
  // ── Electronics ────────────────────────────────────────────────
  e1: {
    bg: ["#F4F6FB", "#DCE3F1"],
    art: (
      <>
        {floor(132, 306)}
        {/* lid */}
        <path d="M112 100h176a9 9 0 0 1 9 9v133H103V109a9 9 0 0 1 9-9z" fill="#C6CCD8" />
        <path d="M112 100h176a9 9 0 0 1 9 9v133h-9V109a9 9 0 0 0-9-9z" fill="#AEB5C4" />
        <rect x="117" y="116" width="166" height="118" rx="4" fill="#161A28" />
        <path d="M117 200l48-36 37 28 32-23 49 35v30H117z" fill="#5B3DF5" opacity="0.5" />
        <circle cx="246" cy="150" r="15" fill="#F08000" opacity="0.65" />
        <circle cx="200" cy="108" r="2.6" fill="#7C7689" />
        {/* deck */}
        <path d="M95 242h210l28 32a6 6 0 0 1-4.6 9.9H71.6A6 6 0 0 1 67 274z" fill="#DDE2EB" />
        <path d="M95 242h210l9.5 11H85.5z" fill="#C6CCD8" />
        {[0, 1, 2].map((r) => (
          <g key={r} opacity="0.5">
            {Array.from({ length: 11 }, (_, c) => (
              <rect
                key={c}
                x={107 + c * 16.6 - r * 2}
                y={256 + r * 6}
                width="12"
                height="4"
                rx="1.6"
                fill="#9AA2B2"
              />
            ))}
          </g>
        ))}
        <rect x="163" y="277" width="74" height="5" rx="2.5" fill="#AEB5C4" />
      </>
    ),
  },
  e2: {
    bg: ["#F3F4F8", "#DFE1EC"],
    art: (
      <>
        {floor(104, 310)}
        {/* open case */}
        <path d="M126 214h148a14 14 0 0 1 14 14v46a20 20 0 0 1-20 20H132a20 20 0 0 1-20-20v-46a14 14 0 0 1 14-14z" fill="#2A2E3C" />
        <path d="M112 240h176v10H112z" fill="#1A1D28" opacity="0.6" />
        <path d="M124 172h152a12 12 0 0 1 12 12v30H112v-30a12 12 0 0 1 12-12z" fill="#3A3F50" />
        <ellipse cx="163" cy="206" rx="27" ry="12" fill="#141824" />
        <ellipse cx="237" cy="206" rx="27" ry="12" fill="#141824" />
        {/* buds seated in the case */}
        <circle cx="163" cy="200" r="21" fill="#F2F3F7" />
        <circle cx="163" cy="200" r="21" fill="#171425" opacity="0.06" />
        <circle cx="163" cy="197" r="8" fill="#C6CCD8" />
        <circle cx="237" cy="200" r="21" fill="#F2F3F7" />
        <circle cx="237" cy="200" r="8" fill="#C6CCD8" />
        {/* loose bud, stem down */}
        <circle cx="292" cy="272" r="20" fill="#F7F8FB" />
        <path d="M286 288h12a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6h-12a6 6 0 0 1-6-6v-22a6 6 0 0 1 6-6z" fill="#EDEFF5" />
        <circle cx="288" cy="268" r="7" fill="#C6CCD8" />
        <rect x="192" y="278" width="16" height="4" rx="2" fill="#5B3DF5" />
      </>
    ),
  },
  e3: {
    bg: ["#F2F5FB", "#D8E0EF"],
    art: (
      <>
        {floor(96, 318)}
        <rect x="66" y="102" width="268" height="158" rx="12" fill="#2C3140" />
        <rect x="76" y="112" width="248" height="128" rx="5" fill="#0F1320" />
        <path d="M76 190l58-42 44 32 40-28 66 46v42H76z" fill="#0E9F6E" opacity="0.45" />
        <circle cx="252" cy="150" r="18" fill="#F08000" opacity="0.6" />
        <rect x="76" y="112" width="248" height="128" rx="5" fill="#FFFFFF" opacity="0.06" />
        <rect x="188" y="248" width="24" height="6" rx="3" fill="#4B5163" />
        {/* stand */}
        <path d="M186 260h28v40h-28z" fill="#3A4052" />
        <path d="M146 300h108a8 8 0 0 1 8 8v6H138v-6a8 8 0 0 1 8-8z" fill="#2C3140" />
      </>
    ),
  },
  e4: {
    bg: ["#F5F3FB", "#E0DCF2"],
    art: (
      <>
        {floor(126, 300)}
        <path d="M74 176h252a14 14 0 0 1 14 14v72a14 14 0 0 1-14 14H74a14 14 0 0 1-14-14v-72a14 14 0 0 1 14-14z" fill="#3B4152" />
        <rect x="70" y="186" width="260" height="80" rx="8" fill="#20242F" />
        {[0, 1, 2, 3].map((r) =>
          Array.from({ length: 15 }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              x={78 + c * 16.6}
              y={192 + r * 18}
              width="14"
              height="15"
              rx="3"
              fill={r === 0 && c > 12 ? "#F08000" : c % 7 === 3 ? "#5B3DF5" : "#E7E9F0"}
            />
          )),
        )}
        <rect x="78" y="264" width="244" height="6" rx="3" fill="#171425" opacity="0.25" />
      </>
    ),
  },
  e5: {
    bg: ["#F1F4FA", "#D9DFEE"],
    art: (
      <>
        {floor(86, 306)}
        <path d="M140 132h120a18 18 0 0 1 18 18v128a18 18 0 0 1-18 18H140a18 18 0 0 1-18-18V150a18 18 0 0 1 18-18z" fill="#2E3444" />
        <path d="M140 132h120a18 18 0 0 1 18 18v14H122v-14a18 18 0 0 1 18-18z" fill="#3C4356" />
        <rect x="140" y="182" width="120" height="70" rx="10" fill="#171B26" />
        <rect x="152" y="196" width="52" height="8" rx="4" fill="#0E9F6E" />
        <rect x="152" y="214" width="80" height="5" rx="2.5" fill="#4B5163" />
        <rect x="152" y="228" width="62" height="5" rx="2.5" fill="#4B5163" />
        {/* USB-C port + lanyard hole */}
        <rect x="182" y="270" width="36" height="9" rx="4.5" fill="#0B0E16" />
        <circle cx="258" cy="152" r="7" fill="#171B26" />
      </>
    ),
  },

  // ── Fashion ────────────────────────────────────────────────────
  f1: {
    bg: ["#FAF6F1", "#EDE2D4"],
    art: (
      <>
        {floor(96, 322)}
        {/* long panjabi */}
        <path d="M168 96h64l52 26a10 10 0 0 1 5.6 11L278 172l-22-8v146a8 8 0 0 1-8 8H152a8 8 0 0 1-8-8V164l-22 8-11.6-39a10 10 0 0 1 5.6-11z" fill="#4A5464" />
        <path d="M200 118v190h48a8 8 0 0 0 8-8V164l22 8 11.6-39a10 10 0 0 0-5.6-11L232 96h-32z" fill="#3F4756" />
        <path d="M168 96h64l-14 16h-36z" fill="#2F3644" />
        <rect x="172" y="88" width="56" height="14" rx="7" fill="#5A6577" />
        <rect x="195" y="112" width="10" height="86" rx="5" fill="#5A6577" />
        {[126, 148, 170, 192].map((y) => (
          <circle key={y} cx="200" cy={y} r="3.4" fill="#D9C6A8" />
        ))}
        <path d="M144 176v130h-1a8 8 0 0 1-7-8V172z" fill="#2F3644" opacity="0.5" />
        <path d="M144 296h112v12H144z" fill="#2F3644" opacity="0.45" />
      </>
    ),
  },
  f2: {
    bg: ["#EFF6F7", "#D6E6EA"],
    art: (
      <>
        {floor(100, 318)}
        <path d="M200 78c26 0 44 16 46 36l-14 12h-64l-14-12c2-20 20-36 46-36z" fill="#2F5D66" />
        <path d="M172 96c8-10 44-10 56 0l-6 22h-44z" fill="#24484F" />
        <path d="M168 112h64l56 30a10 10 0 0 1 5 11l-14 44-25-10v106a8 8 0 0 1-8 8H150a8 8 0 0 1-8-8V197l-25 10-14-44a10 10 0 0 1 5-11z" fill="#367079" />
        <path d="M200 112v190h46a8 8 0 0 0 8-8V197l25 10 14-44a10 10 0 0 0-5-11l-56-30z" fill="#2F5D66" />
        <rect x="196" y="118" width="8" height="180" rx="4" fill="#F08000" />
        <rect x="142" y="286" width="116" height="16" rx="8" fill="#24484F" />
        <path d="M110 197l-9 22 26 10 8-22z" fill="#24484F" />
        <path d="M290 197l9 22-26 10-8-22z" fill="#24484F" />
        <path d="M168 150h30v6h-30z" fill="#FFFFFF" opacity="0.25" />
      </>
    ),
  },
  f3: {
    bg: ["#F1F4FA", "#DCE3F0"],
    art: (
      <>
        {floor(92, 326)}
        <path d="M142 96h116v34l-8 186h-42l-14-124-14 124h-42l-8-186z" fill="#3C5580" />
        <path d="M200 96v96l14 124h42l8-186V96z" fill="#33496E" />
        <rect x="142" y="96" width="116" height="22" rx="4" fill="#2C4062" />
        <rect x="188" y="96" width="24" height="22" rx="4" fill="#3C5580" />
        <path d="M150 124h34l-4 26h-26z" fill="#2C4062" opacity="0.55" />
        <path d="M216 124h34l-4 26h-26z" fill="#2C4062" opacity="0.55" />
        {[152, 248].map((x) => (
          <circle key={x} cx={x} cy="126" r="3" fill="#D9C6A8" />
        ))}
        <path d="M200 118v198" stroke="#D9C6A8" strokeWidth="2" strokeDasharray="7 6" opacity="0.7" />
        <path d="M158 200q42 14 84 0" stroke="#D9C6A8" strokeWidth="2" strokeDasharray="7 6" fill="none" opacity="0.4" />
      </>
    ),
  },
  f4: {
    bg: ["#FBF3F6", "#F0DDE4"],
    art: (
      <>
        {floor(112, 318)}
        <path d="M96 128h208a12 12 0 0 1 12 12v34H84v-34a12 12 0 0 1 12-12z" fill="#B03A5B" />
        <path d="M84 174h232v40H84z" fill="#C4506F" />
        <path d="M84 214h232v40H84z" fill="#B03A5B" />
        <path d="M84 254h232v42a10 10 0 0 1-10 10H94a10 10 0 0 1-10-10z" fill="#9C2F4E" />
        {[140, 190, 230, 276].map((y) => (
          <g key={y}>
            <rect x="84" y={y} width="232" height="7" fill="#D9C6A8" opacity="0.85" />
            <rect x="84" y={y + 9} width="232" height="3" fill="#D9C6A8" opacity="0.5" />
          </g>
        ))}
        <path d="M196 128h58l-14 178h-58z" fill="#D9C6A8" opacity="0.22" />
        <path d="M84 174h232" stroke="#7E2440" strokeWidth="2" opacity="0.35" />
        <path d="M84 254h232" stroke="#7E2440" strokeWidth="2" opacity="0.35" />
      </>
    ),
  },
  f5: {
    bg: ["#F2F6F1", "#DCE7DA"],
    art: (
      <>
        {floor(116, 306)}
        <path d="M92 244c0-40 22-64 52-78 24-11 34-30 58-30 26 0 40 18 52 36 10 15 30 22 44 30 12 7 12 26 0 32H100c-6 0-8-4-8-10z" fill="#5A6B4B" />
        <path d="M202 136c26 0 40 18 52 36 10 15 30 22 44 30 12 7 12 26 0 32h-96z" fill="#4A5A3E" />
        <path d="M92 244h206c12 0 12 20 0 26H100c-6 0-8-4-8-10z" fill="#F1EFE7" />
        <path d="M96 270h202v10H96z" fill="#2F3644" />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={100 + i * 20} y="280" width="13" height="8" rx="3" fill="#2F3644" />
        ))}
        <path d="M144 200q32 -34 70 -52l18 24q-36 18-64 44z" fill="#4A5A3E" opacity="0.6" />
        <path d="M246 136c22 9 32 28 34 46l-19 4c-2-14-9-26-24-33z" fill="#F1EFE7" opacity="0.55" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${150 + i * 20} ${186 + i * 8}l24 ${-6 + i * 2}`}
            stroke="#F1EFE7"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}
        <path d="M112 232c4-22 18-34 34-42l8 14c-16 8-24 18-26 32z" fill="#F08000" opacity="0.85" />
        <path d="M232 142c14 6 20 20 22 32l-16 4c-2-12-6-20-14-26z" fill="#F1EFE7" opacity="0.5" />
      </>
    ),
  },

  // ── Home & Living ──────────────────────────────────────────────
  h1: {
    bg: ["#FBF5EE", "#EEDFCB"],
    art: (
      <>
        {floor(118, 314)}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <ellipse cx="176" cy={286 - i * 17} rx="92" ry="22" fill={i % 2 ? "#B8734A" : "#C98456"} />
            <ellipse cx="176" cy={281 - i * 17} rx="92" ry="22" fill={i % 2 ? "#C98456" : "#D89467"} />
          </g>
        ))}
        <ellipse cx="176" cy="214" rx="92" ry="22" fill="#E4A87C" />
        <ellipse cx="176" cy="214" rx="62" ry="14" fill="#C98456" opacity="0.6" />
        <path d="M256 208a44 44 0 0 0 88 0z" fill="#C98456" />
        <ellipse cx="300" cy="208" rx="44" ry="12" fill="#E4A87C" />
        <path d="M254 246h52v46a10 10 0 0 1-10 10h-32a10 10 0 0 1-10-10z" fill="#B8734A" />
        <ellipse cx="280" cy="246" rx="26" ry="8" fill="#D89467" />
        <path d="M306 258h10a14 14 0 0 1 0 28h-10" fill="none" stroke="#B8734A" strokeWidth="9" />
      </>
    ),
  },
  h2: {
    bg: ["#FAF6EC", "#E8DCC2"],
    art: (
      <>
        <path d="M74 262l60-124h132l60 124z" fill="#C9AE7A" />
        <path d="M200 138h66l60 124H200z" fill="#BC9F68" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M${134 + i * 19} 138L${100 + i * 29} 262`} stroke="#A88A55" strokeWidth="2.5" opacity="0.55" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${130 - i * 12} ${162 + i * 25}h${140 + i * 24}`} stroke="#A88A55" strokeWidth="2.5" opacity="0.4" />
        ))}
        <path d="M74 262l60-124h132l60 124z" fill="none" stroke="#8F7440" strokeWidth="4" opacity="0.5" />
        {Array.from({ length: 17 }, (_, i) => (
          <rect key={i} x={78 + i * 15} y="262" width="4" height="16" rx="2" fill="#D9C6A8" />
        ))}
      </>
    ),
  },
  h3: {
    bg: ["#FBF4E7", "#F0DFBE"],
    art: (
      <>
        {floor(72, 314)}
        <path d="M124 116h152l40 92H84z" fill="#F08000" opacity="0.14" />
        <path d="M148 116h104l30 84H118z" fill="#E8DCC2" />
        <path d="M200 116h52l30 84h-82z" fill="#D8C7A6" />
        <ellipse cx="200" cy="200" rx="82" ry="10" fill="#F5EEDF" />
        <ellipse cx="200" cy="116" rx="52" ry="7" fill="#D8C7A6" />
        <ellipse cx="200" cy="206" rx="34" ry="9" fill="#F08000" opacity="0.5" />
        <rect x="192" y="200" width="16" height="86" rx="4" fill="#8A6A44" />
        <circle cx="216" cy="252" r="11" fill="#B08653" />
        <circle cx="216" cy="252" r="4" fill="#6E5233" />
        <path d="M156 286h88a10 10 0 0 1 10 10v6H146v-6a10 10 0 0 1 10-10z" fill="#8A6A44" />
        <ellipse cx="200" cy="302" rx="54" ry="9" fill="#6E5233" />
      </>
    ),
  },
  h4: {
    bg: ["#FBF2F4", "#EFDBDF"],
    art: (
      <>
        {floor(110, 320)}
        <path d="M118 130h132a16 16 0 0 1 16 16v116a16 16 0 0 1-16 16H118a16 16 0 0 1-16-16V146a16 16 0 0 1 16-16z" fill="#C4506F" />
        <path d="M184 130h66a16 16 0 0 1 16 16v116a16 16 0 0 1-16 16h-66z" fill="#B03A5B" />
        <circle cx="184" cy="204" r="40" fill="none" stroke="#F5EEDF" strokeWidth="3" />
        <circle cx="184" cy="204" r="16" fill="#F5EEDF" opacity="0.8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
          <path key={d} d="M184 176q10 -18 0 -30 q-10 12 0 30z" fill="#F5EEDF" opacity="0.75" transform={`rotate(${d} 184 204)`} />
        ))}
        <path d="M112 168h144" stroke="#F5EEDF" strokeWidth="2" strokeDasharray="6 7" opacity="0.55" />
        <path d="M112 246h144" stroke="#F5EEDF" strokeWidth="2" strokeDasharray="6 7" opacity="0.55" />
        <path d="M212 196h74a16 16 0 0 1 16 16v76a16 16 0 0 1-16 16h-74z" fill="#5A6B4B" />
        <path d="M258 214l18 26-18 26-18-26z" fill="none" stroke="#F5EEDF" strokeWidth="3" />
        <circle cx="258" cy="240" r="6" fill="#F5EEDF" opacity="0.85" />
        <path d="M222 204h74" stroke="#F5EEDF" strokeWidth="2" strokeDasharray="5 6" opacity="0.6" />
        <path d="M222 288h74" stroke="#F5EEDF" strokeWidth="2" strokeDasharray="5 6" opacity="0.6" />
      </>
    ),
  },
  h5: {
    bg: ["#F6F3EE", "#E3DCD0"],
    art: (
      <>
        {floor(86, 316)}
        <path d="M144 210h112v66a26 26 0 0 1-26 26h-60a26 26 0 0 1-26-26z" fill="#DCE6EA" />
        <path d="M148 250h104v26a26 26 0 0 1-26 26h-52a26 26 0 0 1-26-26z" fill="#6E4A2E" opacity="0.8" />
        <path d="M144 210h112v10H144z" fill="#C6D3D8" />
        <path d="M256 226h12a16 16 0 0 1 0 32h-12" fill="none" stroke="#C6D3D8" strokeWidth="8" />
        <path d="M124 128h152l-34 78H158z" fill="#F1EFE7" />
        <path d="M200 128h76l-34 78h-42z" fill="#DED9CB" />
        <ellipse cx="200" cy="128" rx="76" ry="13" fill="#FBFAF6" />
        <ellipse cx="200" cy="128" rx="58" ry="9" fill="#D6D0C0" />
        <path d="M152 132h96l-22 52h-52z" fill="#E8DCC2" />
        <path d="M172 140h56" stroke="#CBBB9B" strokeWidth="3" />
        <circle cx="200" cy="224" r="5" fill="#6E4A2E" />
      </>
    ),
  },

  // ── Beauty ─────────────────────────────────────────────────────
  b1: {
    bg: ["#F1F7EF", "#DAE9D5"],
    art: (
      <>
        {floor(70, 318)}
        <path d="M158 122h84l-6 154a30 30 0 0 1-30 28h-12a30 30 0 0 1-30-28z" fill="#EDF3E9" />
        <path d="M200 122h42l-6 154a30 30 0 0 1-30 28h-6z" fill="#D8E4D0" />
        <path d="M156 108h88a6 6 0 0 1 6 6v10H150v-10a6 6 0 0 1 6-6z" fill="#5A6B4B" />
        {[160, 176, 192, 208, 224, 238].map((x) => (
          <rect key={x} x={x} y="108" width="4" height="16" fill="#4A5A3E" opacity="0.5" />
        ))}
        <path d="M156 176h88l-3 74h-82z" fill="#5A6B4B" />
        <path d="M200 196q22 8 22 28-22 2-22-28z" fill="#EDF3E9" />
        <path d="M178 196q-22 8-22 28 22 2 22-28z" fill="#EDF3E9" opacity="0.7" />
        <rect x="172" y="234" width="56" height="5" rx="2.5" fill="#EDF3E9" opacity="0.8" />
        <rect x="182" y="264" width="36" height="4" rx="2" fill="#B8C4B0" />
      </>
    ),
  },
  b2: {
    bg: ["#FBF4E4", "#F0DFB8"],
    art: (
      <>
        {floor(68, 316)}
        <path d="M162 158h76a20 20 0 0 1 20 20v106a20 20 0 0 1-20 20h-76a20 20 0 0 1-20-20V178a20 20 0 0 1 20-20z" fill="#B5711C" />
        <path d="M200 158h38a20 20 0 0 1 20 20v106a20 20 0 0 1-20 20h-38z" fill="#96590F" />
        <path d="M154 176h20v128h-20z" fill="#D89434" opacity="0.55" />
        <path d="M176 134h48v26h-48z" fill="#B5711C" />
        <rect x="170" y="98" width="60" height="38" rx="8" fill="#3A2E20" />
        <rect x="176" y="90" width="48" height="12" rx="6" fill="#4C3D2A" />
        <rect x="152" y="204" width="96" height="66" rx="6" fill="#F5EEDF" />
        <circle cx="200" cy="228" r="14" fill="#B5711C" opacity="0.35" />
        <path d="M200 216q14 12 0 24-14-12 0-24z" fill="#8A6A44" />
        <rect x="168" y="250" width="64" height="5" rx="2.5" fill="#B08653" />
        <rect x="180" y="260" width="40" height="4" rx="2" fill="#C9B893" />
      </>
    ),
  },
  b3: {
    bg: ["#FCF1F4", "#F3D9E1"],
    art: (
      <>
        {floor(62, 316)}
        <path d="M180 128h40l-2 44h-36z" fill="#B03A5B" />
        <path d="M200 128h20l-2 44h-18z" fill="#94284A" />
        <path d="M180 128l14-18h26l-6 18z" fill="#C4506F" />
        <rect x="172" y="172" width="56" height="34" rx="4" fill="#D9C6A8" />
        <rect x="200" y="172" width="28" height="34" rx="4" fill="#C4AE8B" />
        <path d="M170 206h60a10 10 0 0 1 10 10v78a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12v-78a10 10 0 0 1 10-10z" fill="#2F3644" />
        <path d="M200 206h30a10 10 0 0 1 10 10v78a12 12 0 0 1-12 12h-28z" fill="#20252F" />
        <rect x="160" y="238" width="80" height="10" rx="5" fill="#D9C6A8" />
        <rect x="176" y="262" width="48" height="5" rx="2.5" fill="#7C7689" />
        <path d="M262 214h34a8 8 0 0 1 8 8v72a8 8 0 0 1-8 8h-34a8 8 0 0 1-8-8v-72a8 8 0 0 1 8-8z" fill="#20252F" />
        <rect x="254" y="236" width="50" height="8" rx="4" fill="#D9C6A8" />
      </>
    ),
  },
  b4: {
    bg: ["#FDF6E8", "#FAE3B8"],
    art: (
      <>
        {floor(70, 316)}
        <path d="M160 168h80a18 18 0 0 1 18 18v100a18 18 0 0 1-18 18h-80a18 18 0 0 1-18-18V186a18 18 0 0 1 18-18z" fill="#FBFAF6" />
        <path d="M200 168h40a18 18 0 0 1 18 18v100a18 18 0 0 1-18 18h-40z" fill="#EDE9E0" />
        <rect x="180" y="140" width="40" height="30" rx="4" fill="#E4E1EC" />
        <rect x="168" y="118" width="42" height="24" rx="8" fill="#F08000" />
        <rect x="196" y="106" width="16" height="20" rx="6" fill="#F08000" />
        <rect x="150" y="204" width="100" height="74" rx="8" fill="#F08000" />
        <circle cx="200" cy="230" r="16" fill="#FDF6E8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
          <rect key={d} x="198" y="200" width="4" height="10" rx="2" fill="#FDF6E8" transform={`rotate(${d} 200 230)`} />
        ))}
        <rect x="168" y="254" width="64" height="7" rx="3.5" fill="#FDF6E8" />
        <rect x="182" y="266" width="36" height="4" rx="2" fill="#FDF6E8" opacity="0.7" />
      </>
    ),
  },
  b5: {
    bg: ["#FCF2F5", "#F4DCE4"],
    art: (
      <>
        {floor(64, 316)}
        <path d="M164 160h72a16 16 0 0 1 16 16v112a16 16 0 0 1-16 16h-72a16 16 0 0 1-16-16V176a16 16 0 0 1 16-16z" fill="#F6E4EA" />
        <path d="M148 216h104v72a16 16 0 0 1-16 16h-72a16 16 0 0 1-16-16z" fill="#E4A0B6" />
        <path d="M200 160h36a16 16 0 0 1 16 16v112a16 16 0 0 1-16 16h-36z" fill="#171425" opacity="0.06" />
        <path d="M160 176h12v120h-12z" fill="#FFFFFF" opacity="0.6" />
        <rect x="182" y="134" width="36" height="28" rx="4" fill="#E4E1EC" />
        <rect x="172" y="112" width="56" height="24" rx="8" fill="#C4506F" />
        <rect x="216" y="118" width="26" height="10" rx="5" fill="#C4506F" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={252 + i * 12} cy={110 - i * 6} r={3.5 - i * 0.4} fill="#C4506F" opacity={0.5 - i * 0.08} />
        ))}
        <rect x="160" y="230" width="80" height="44" rx="6" fill="#FBF3F6" opacity="0.9" />
        <path d="M200 240q12 10 0 20-12-10 0-20z" fill="#C4506F" opacity="0.7" />
        <rect x="176" y="264" width="48" height="4" rx="2" fill="#C4506F" opacity="0.4" />
      </>
    ),
  },

  // ── Grocery ────────────────────────────────────────────────────
  g1: {
    bg: ["#F5F7EC", "#E2E9CC"],
    art: (
      <>
        {floor(104, 318)}
        <path d="M116 148h168a16 16 0 0 1 16 16v122a20 20 0 0 1-20 20H120a20 20 0 0 1-20-20V164a16 16 0 0 1 16-16z" fill="#D9C6A8" />
        <path d="M200 148h84a16 16 0 0 1 16 16v122a20 20 0 0 1-20 20h-80z" fill="#C9B48F" />
        <path d="M108 132h184a10 10 0 0 1 8 16l-8 10H108l-8-10a10 10 0 0 1 8-16z" fill="#BFA87F" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${106 + i * 16} 158v148`} stroke="#BFA87F" strokeWidth="1.6" opacity="0.5" />
        ))}
        <rect x="150" y="176" width="100" height="60" rx="8" fill="#FBFAF6" />
        {Array.from({ length: 24 }, (_, i) => (
          <ellipse
            key={i}
            cx={162 + (i % 8) * 12}
            cy={190 + Math.floor(i / 8) * 16}
            rx="5"
            ry="3"
            fill="#E8DCC2"
          />
        ))}
        <rect x="140" y="252" width="120" height="34" rx="6" fill="#5A6B4B" />
        <rect x="156" y="262" width="88" height="7" rx="3.5" fill="#F5EEDF" />
        <rect x="176" y="274" width="48" height="5" rx="2.5" fill="#F5EEDF" opacity="0.7" />
      </>
    ),
  },
  g2: {
    bg: ["#FDF7E3", "#F7E5AD"],
    art: (
      <>
        {floor(72, 316)}
        <path d="M156 176h88a18 18 0 0 1 18 18v92a18 18 0 0 1-18 18h-88a18 18 0 0 1-18-18v-92a18 18 0 0 1 18-18z" fill="#E8B21E" />
        <path d="M200 176h44a18 18 0 0 1 18 18v92a18 18 0 0 1-18 18h-44z" fill="#CE9711" />
        <path d="M148 194h14v106h-14z" fill="#F6D765" opacity="0.7" />
        <path d="M170 146h60l14 30h-88z" fill="#E8B21E" />
        <rect x="180" y="112" width="40" height="36" rx="4" fill="#CE9711" />
        <rect x="174" y="100" width="52" height="18" rx="6" fill="#5A4318" />
        <rect x="146" y="206" width="108" height="70" rx="6" fill="#F5EEDF" />
        <circle cx="200" cy="230" r="15" fill="#E8B21E" />
        <path d="M200 220q9 10 0 20-9-10 0-20z" fill="#5A4318" />
        <rect x="164" y="254" width="72" height="6" rx="3" fill="#5A4318" opacity="0.8" />
        <rect x="180" y="264" width="40" height="4" rx="2" fill="#8A6A44" />
      </>
    ),
  },
  g3: {
    bg: ["#FBF3DF", "#F2DFA6"],
    art: (
      <>
        {floor(82, 316)}
        <path d="M146 178h108a12 12 0 0 1 12 12v92a22 22 0 0 1-22 22H156a22 22 0 0 1-22-22v-92a12 12 0 0 1 12-12z" fill="#F3D9A0" opacity="0.55" />
        <path d="M134 208h132v74a22 22 0 0 1-22 22H156a22 22 0 0 1-22-22z" fill="#C98416" />
        <path d="M200 208h66v74a22 22 0 0 1-22 22h-44z" fill="#AA6C0C" />
        <path d="M144 190h14v112h-14z" fill="#FFFFFF" opacity="0.35" />
        <path d="M140 152h120a10 10 0 0 1 10 10v18H130v-18a10 10 0 0 1 10-10z" fill="#5A4318" />
        <rect x="130" y="176" width="140" height="8" rx="4" fill="#43310F" />
        <path d="M200 214l30 17v34l-30 17-30-17v-34z" fill="#F5EEDF" />
        <path d="M200 232l14 8v16l-14 8-14-8v-16z" fill="#E8B21E" />
        <rect x="176" y="272" width="48" height="4" rx="2" fill="#8A6A44" />
        <rect x="288" y="152" width="10" height="86" rx="5" fill="#B08653" />
        {[196, 208, 220, 232].map((y) => (
          <ellipse key={y} cx="293" cy={y} rx="17" ry="6" fill="#8A6A44" />
        ))}
        <circle cx="293" cy="148" r="8" fill="#B08653" />
      </>
    ),
  },
  g4: {
    bg: ["#F4EFE9", "#DFD2C4"],
    art: (
      <>
        {floor(82, 318)}
        <path d="M128 146h144a14 14 0 0 1 14 14v128a16 16 0 0 1-16 16H130a16 16 0 0 1-16-16V160a14 14 0 0 1 14-14z" fill="#4B3524" />
        <path d="M200 146h72a14 14 0 0 1 14 14v128a16 16 0 0 1-16 16h-70z" fill="#3B2A1C" />
        <path d="M120 128h160a8 8 0 0 1 6 13l-6 7H120l-6-7a8 8 0 0 1 6-13z" fill="#5D4430" />
        <rect x="114" y="120" width="172" height="12" rx="6" fill="#6E5233" />
        <rect x="140" y="186" width="120" height="86" rx="8" fill="#F1EFE7" />
        <ellipse cx="200" cy="212" rx="16" ry="20" fill="#4B3524" />
        <path d="M200 192v40" stroke="#F1EFE7" strokeWidth="3" />
        <rect x="158" y="242" width="84" height="7" rx="3.5" fill="#4B3524" />
        <rect x="172" y="256" width="56" height="5" rx="2.5" fill="#8A6A44" />
        <circle cx="262" cy="164" r="9" fill="#2F2116" />
        {[112, 136, 286].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy={302 + i * 4} rx="12" ry="9" fill="#4B3524" />
            <path d={`M${x - 8} ${302 + i * 4}q8 -6 16 0`} stroke="#2F2116" strokeWidth="2" fill="none" />
          </g>
        ))}
      </>
    ),
  },
  g5: {
    bg: ["#F7F5EC", "#E7E2C8"],
    art: (
      <>
        {floor(92, 318)}
        <path d="M132 168h136a18 18 0 0 1 18 18v96a20 20 0 0 1-20 20H134a20 20 0 0 1-20-20v-96a18 18 0 0 1 18-18z" fill="#E4DCC0" />
        <path d="M200 168h68a18 18 0 0 1 18 18v96a20 20 0 0 1-20 20h-66z" fill="#D4CAA8" />
        <path d="M126 152h148a8 8 0 0 1 6 13l-8 9H128l-8-9a8 8 0 0 1 6-13z" fill="#C9BE98" />
        <rect x="120" y="144" width="160" height="11" rx="5.5" fill="#B8AC84" />
        <rect x="152" y="192" width="96" height="52" rx="8" fill="#FBFAF6" />
        {Array.from({ length: 18 }, (_, i) => (
          <ellipse
            key={i}
            cx={164 + (i % 6) * 15}
            cy={206 + Math.floor(i / 6) * 15}
            rx="6"
            ry="3"
            fill="#EDE6D0"
          />
        ))}
        <rect x="142" y="256" width="116" height="30" rx="6" fill="#B03A5B" />
        <rect x="158" y="264" width="84" height="7" rx="3.5" fill="#FBF3F6" />
        <rect x="178" y="276" width="44" height="4" rx="2" fill="#FBF3F6" opacity="0.7" />
      </>
    ),
  },

  // ── Sports ─────────────────────────────────────────────────────
  s1: {
    bg: ["#EDF6F8", "#D2E7EE"],
    art: (
      <>
        {floor(76, 322)}
        <g transform="rotate(-24 200 200)">
          <ellipse cx="200" cy="146" rx="66" ry="80" fill="none" stroke="#1F3A56" strokeWidth="11" />
          <ellipse cx="200" cy="146" rx="58" ry="72" fill="#EAF4F7" opacity="0.75" />
          {[-40, -26, -13, 0, 13, 26, 40].map((dx) => (
            <path key={dx} d={`M${200 + dx} 78v136`} stroke="#9FB6C6" strokeWidth="1.6" />
          ))}
          {[-52, -34, -17, 0, 17, 34, 52].map((dy) => (
            <path key={dy} d={`M144 ${146 + dy}h112`} stroke="#9FB6C6" strokeWidth="1.6" />
          ))}
          <path d="M182 224h36l-6 26h-24z" fill="#1F3A56" />
          <rect x="190" y="248" width="20" height="46" fill="#2C536F" />
          <rect x="184" y="286" width="32" height="62" rx="10" fill="#2F3644" />
          {[296, 310, 324, 338].map((y) => (
            <path key={y} d={`M184 ${y}l32 -8`} stroke="#4B5163" strokeWidth="3" />
          ))}
        </g>
      </>
    ),
  },
  s2: {
    bg: ["#F7EFEF", "#E8D2D2"],
    art: (
      <>
        <ellipse cx="200" cy="306" rx="126" ry="18" fill="#171425" opacity="0.11" />
        {[
          { x: 138, y: 246, r: 52 },
          { x: 258, y: 252, r: 46 },
          { x: 200, y: 168, r: 48 },
        ].map((b, i) => (
          <g key={i}>
            <circle cx={b.x} cy={b.y} r={b.r} fill="#9C2F3A" />
            <path
              d={`M${b.x - b.r} ${b.y}a${b.r} ${b.r} 0 0 0 ${b.r * 2} 0z`}
              fill="#7E2430"
              opacity="0.55"
            />
            <circle cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.35} r={b.r * 0.42} fill="#B8474F" opacity="0.45" />
            <path
              d={`M${b.x - b.r + 6} ${b.y - 6}q${b.r} 22 ${b.r * 2 - 12} 0`}
              stroke="#F5EEDF"
              strokeWidth="3"
              fill="none"
            />
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <path
                key={s}
                d={`M${b.x - b.r + 16 + s * ((b.r * 2 - 32) / 5)} ${b.y - 4}v10`}
                stroke="#F5EEDF"
                strokeWidth="2.4"
              />
            ))}
          </g>
        ))}
      </>
    ),
  },
  s3: {
    bg: ["#F2F7F5", "#D9EAE4"],
    art: (
      <>
        {floor(120, 310)}
        <path d="M78 262h176v34H78z" fill="#3E8C77" />
        <path d="M78 262h176v10H78z" fill="#57A891" />
        <ellipse cx="254" cy="240" rx="58" ry="58" fill="#3E8C77" />
        <ellipse cx="254" cy="240" rx="58" ry="58" fill="#171425" opacity="0.08" />
        <ellipse cx="254" cy="240" rx="34" ry="34" fill="#57A891" />
        <ellipse cx="254" cy="240" rx="14" ry="14" fill="#EAF4F1" />
        <path d="M254 182a58 58 0 0 1 0 116" fill="none" stroke="#2E6E5D" strokeWidth="4" />
        <rect x="222" y="176" width="66" height="12" rx="6" fill="#D9C6A8" />
        <rect x="222" y="292" width="66" height="12" rx="6" fill="#D9C6A8" />
        <path d="M248 176v-30a10 10 0 0 1 10-10h34" stroke="#D9C6A8" strokeWidth="9" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  s4: {
    bg: ["#F1F3F7", "#DADEE9"],
    art: (
      <>
        {floor(110, 312)}
        <rect x="96" y="176" width="86" height="120" rx="12" fill="#2F3644" />
        <rect x="218" y="176" width="86" height="120" rx="12" fill="#2F3644" />
        <rect x="96" y="176" width="86" height="120" rx="12" fill="#FFFFFF" opacity="0.06" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={100} y={186 + i * 28} width="78" height="20" rx="5" fill="#4B5163" />
            <rect x={222} y={186 + i * 28} width="78" height="20" rx="5" fill="#4B5163" />
          </g>
        ))}
        <rect x="182" y="216" width="36" height="40" rx="8" fill="#9AA2B2" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x="182" y={220 + i * 5} width="36" height="2" fill="#7C8394" />
        ))}
        <circle cx="139" cy="236" r="26" fill="#F08000" />
        <circle cx="139" cy="236" r="16" fill="#C46600" />
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <rect key={d} x="137" y="212" width="4" height="9" rx="2" fill="#F5EEDF" transform={`rotate(${d} 139 236)`} />
        ))}
        <circle cx="261" cy="236" r="26" fill="#2F3644" />
        <circle cx="261" cy="236" r="10" fill="#4B5163" />
      </>
    ),
  },
  s5: {
    bg: ["#EEF5F9", "#D4E5F0"],
    art: (
      <>
        {floor(62, 318)}
        <path d="M160 148h80a14 14 0 0 1 14 14v122a20 20 0 0 1-20 20h-68a20 20 0 0 1-20-20V162a14 14 0 0 1 14-14z" fill="#4E7FA6" />
        <path d="M200 148h40a14 14 0 0 1 14 14v122a20 20 0 0 1-20 20h-34z" fill="#3C6B90" />
        <path d="M154 166h14v130h-14z" fill="#8FBBD8" opacity="0.7" />
        <path d="M172 118h56v30h-56z" fill="#3C6B90" />
        <rect x="166" y="96" width="68" height="26" rx="10" fill="#2F3644" />
        <path d="M234 100h16a12 12 0 0 1 0 24h-16" fill="none" stroke="#2F3644" strokeWidth="8" />
        <rect x="150" y="196" width="100" height="58" rx="8" fill="#F5F9FC" opacity="0.9" />
        <path d="M186 210h28l-6 18h10l-22 26 6-20h-10z" fill="#4E7FA6" />
        <rect x="168" y="266" width="64" height="5" rx="2.5" fill="#8FBBD8" />
      </>
    ),
  },

  // ── Books ──────────────────────────────────────────────────────
  k1: {
    bg: ["#F6F2E6", "#E5DBC0"],
    art: (
      <>
        {floor(78, 314)}
        <path d="M136 92h124a10 10 0 0 1 10 10v190a10 10 0 0 1-10 10H136z" fill="#2C5A63" />
        <path d="M124 92h14v210h-14a8 8 0 0 1-8-8V100a8 8 0 0 1 8-8z" fill="#1E4048" />
        <path d="M138 92h8v210h-8z" fill="#FFFFFF" opacity="0.12" />
        <path d="M148 214q28 -22 56 0t56 0v58H148z" fill="#7FB6AE" opacity="0.8" />
        <path d="M148 240q28 -22 56 0t56 0v32H148z" fill="#D9C6A8" opacity="0.65" />
        <circle cx="228" cy="140" r="24" fill="#F08000" opacity="0.85" />
        <rect x="152" y="120" width="88" height="9" rx="4.5" fill="#F5EEDF" />
        <rect x="152" y="138" width="62" height="9" rx="4.5" fill="#F5EEDF" />
        <rect x="152" y="286" width="44" height="5" rx="2.5" fill="#F5EEDF" opacity="0.6" />
      </>
    ),
  },
  k2: {
    bg: ["#F1EFFB", "#DCD6F6"],
    art: (
      <>
        {floor(82, 312)}
        <path d="M140 88h122a12 12 0 0 1 12 12v192a12 12 0 0 1-12 12H140z" fill="#3D24C4" />
        <path d="M126 88h14v216h-14a10 10 0 0 1-10-10V98a10 10 0 0 1 10-10z" fill="#2C1795" />
        <rect x="120" y="120" width="6" height="152" fill="#5B3DF5" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={162 + c * 34}
              y={186 + r * 34}
              width="26"
              height="26"
              rx="6"
              fill={r === c ? "#F08000" : "#7C63F8"}
            />
          )),
        )}
        <rect x="158" y="118" width="98" height="10" rx="5" fill="#EEEAFE" />
        <rect x="158" y="138" width="70" height="10" rx="5" fill="#EEEAFE" />
        <rect x="158" y="284" width="40" height="5" rx="2.5" fill="#EEEAFE" opacity="0.6" />
      </>
    ),
  },
  k3: {
    bg: ["#FAF4EE", "#EBDCCB"],
    art: (
      <>
        {floor(84, 316)}
        <path d="M144 96h118a10 10 0 0 1 10 10v186a10 10 0 0 1-10 10H144z" fill="#8A3324" />
        <path d="M124 96h20v206h-20a8 8 0 0 1-8-8V104a8 8 0 0 1 8-8z" fill="#6B2317" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M116 ${130 + i * 34}h28`} stroke="#C08A5A" strokeWidth="2" opacity="0.6" />
        ))}
        <rect x="144" y="176" width="128" height="52" fill="#D9C6A8" />
        <rect x="160" y="192" width="96" height="9" rx="4.5" fill="#8A3324" />
        <rect x="176" y="208" width="64" height="6" rx="3" fill="#8A3324" opacity="0.7" />
        <rect x="162" y="126" width="92" height="9" rx="4.5" fill="#F5EEDF" />
        <rect x="162" y="144" width="58" height="9" rx="4.5" fill="#F5EEDF" opacity="0.8" />
        <rect x="162" y="266" width="66" height="6" rx="3" fill="#F5EEDF" opacity="0.5" />
      </>
    ),
  },
  k4: {
    bg: ["#EFF4F7", "#D5E3EC"],
    art: (
      <>
        {floor(80, 314)}
        <path d="M138 94h122a10 10 0 0 1 10 10v188a10 10 0 0 1-10 10H138z" fill="#F1EFE7" />
        <path d="M124 94h14v212h-14a8 8 0 0 1-8-8V102a8 8 0 0 1 8-8z" fill="#D8D2C2" />
        <path d="M138 196h132v46H138z" fill="#4E7FA6" opacity="0.85" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M138 ${208 + i * 14}q22 -10 44 0t44 0t44 0`}
            stroke="#EFF4F7"
            strokeWidth="3"
            fill="none"
          />
        ))}
        <rect x="156" y="124" width="94" height="8" rx="4" fill="#2F3644" />
        <rect x="156" y="142" width="66" height="8" rx="4" fill="#2F3644" opacity="0.7" />
        <rect x="156" y="264" width="52" height="5" rx="2.5" fill="#7C7689" />
        <path d="M240 152l14 -18 14 18-14 12z" fill="#F08000" opacity="0.8" />
      </>
    ),
  },
  k5: {
    bg: ["#FBF6E9", "#F1E3BE"],
    art: (
      <>
        {floor(86, 314)}
        <path d="M146 94h116a10 10 0 0 1 10 10v188a10 10 0 0 1-10 10H146z" fill="#F5EEDF" />
        <path d="M134 94h12v208h-12a8 8 0 0 1-8-8V102a8 8 0 0 1 8-8z" fill="#DED3B6" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i}>
            <path d={`M120 ${118 + i * 28}h26`} stroke="#B08653" strokeWidth="5" strokeLinecap="round" />
            <circle cx="120" cy={118 + i * 28} r="5" fill="none" stroke="#B08653" strokeWidth="4" />
          </g>
        ))}
        <circle cx="206" cy="212" r="42" fill="none" stroke="#2F3644" strokeWidth="4" />
        <path d="M164 254l84 -84" stroke="#2F3644" strokeWidth="4" />
        <path d="M186 192h40v40h-40z" fill="none" stroke="#F08000" strokeWidth="4" />
        <rect x="162" y="122" width="92" height="9" rx="4.5" fill="#2F3644" />
        <rect x="162" y="140" width="60" height="9" rx="4.5" fill="#2F3644" opacity="0.65" />
        <path d="M266 272l16 -46 10 4 -14 46z" fill="#F08000" />
        <path d="M266 272l12 4 -12 8z" fill="#2F3644" />
      </>
    ),
  },

  // ── Kids & Toys ────────────────────────────────────────────────
  t1: {
    bg: ["#F0F5FB", "#D7E5F4"],
    art: (
      <>
        {floor(124, 312)}
        <rect x="86" y="256" width="66" height="46" rx="4" fill="#E8B21E" />
        <rect x="158" y="256" width="66" height="46" rx="4" fill="#4E7FA6" />
        <rect x="230" y="256" width="66" height="46" rx="4" fill="#C4506F" />
        <path d="M108 256v-42a4 4 0 0 1 4-4h76a4 4 0 0 1 4 4v42h-24v-20a18 18 0 0 0-36 0v20z" fill="#5A6B4B" />
        <rect x="204" y="210" width="44" height="46" rx="4" fill="#4E7FA6" />
        <rect x="256" y="210" width="44" height="46" rx="4" fill="#D9C6A8" />
        <path d="M108 210h84l-42 -44z" fill="#C4506F" />
        <rect x="232" y="166" width="44" height="44" rx="4" fill="#E8B21E" />
        <circle cx="254" cy="188" r="13" fill="#F5EEDF" />
        <rect x="86" y="256" width="66" height="10" rx="4" fill="#FFFFFF" opacity="0.25" />
        <rect x="158" y="256" width="66" height="10" rx="4" fill="#FFFFFF" opacity="0.25" />
        <rect x="230" y="256" width="66" height="10" rx="4" fill="#FFFFFF" opacity="0.25" />
      </>
    ),
  },
  t2: {
    bg: ["#F5F1FB", "#DFD8F3"],
    art: (
      <>
        {floor(70, 318)}
        <ellipse cx="200" cy="200" rx="118" ry="118" fill="#F08000" opacity="0.12" />
        <ellipse cx="200" cy="200" rx="80" ry="80" fill="#F08000" opacity="0.12" />
        <path d="M200 88c26 24 38 62 38 104v42h-76v-42c0-42 12-80 38-104z" fill="#F5F3FA" />
        <path d="M200 88c26 24 38 62 38 104v42h-38z" fill="#DED9EC" />
        <path d="M162 196l-30 42v20h30z" fill="#C4506F" />
        <path d="M238 196l30 42v20h-30z" fill="#C4506F" />
        <circle cx="200" cy="164" r="24" fill="#4E7FA6" />
        <circle cx="200" cy="164" r="14" fill="#9FD0EA" />
        <path d="M164 258h72v14a10 10 0 0 1-10 10h-52a10 10 0 0 1-10-10z" fill="#8F8AA6" />
        <path d="M182 282h36l-18 26z" fill="#F08000" opacity="0.85" />
        <rect x="186" y="290" width="28" height="6" rx="3" fill="#F08000" opacity="0.5" />
      </>
    ),
  },
  t3: {
    bg: ["#FAF3F5", "#EFDDE3"],
    art: (
      <>
        <path d="M78 258l62-116h120l62 116z" fill="#171425" opacity="0.09" transform="translate(0,10)" />
        <path d="M78 252l62-116h120l62 116z" fill="#F2DCE2" />
        <path d="M200 136h60l62 116H200z" fill="#E7CBD4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${140 + i * 30} 136L${112 + i * 44} 252`} stroke="#C4506F" strokeWidth="2" strokeDasharray="7 6" opacity="0.5" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${134 - i * 16} ${160 + i * 25}h${132 + i * 32}`} stroke="#C4506F" strokeWidth="2" strokeDasharray="7 6" opacity="0.45" />
        ))}
        <path d="M78 252l62-116h120l62 116z" fill="none" stroke="#C4506F" strokeWidth="5" opacity="0.55" />
        <circle cx="200" cy="196" r="22" fill="#5A6B4B" opacity="0.5" />
        <circle cx="152" cy="222" r="12" fill="#E8B21E" opacity="0.55" />
        <circle cx="252" cy="176" r="12" fill="#4E7FA6" opacity="0.5" />
      </>
    ),
  },
  t4: {
    bg: ["#EFF3FA", "#D6E0F1"],
    art: (
      <>
        {floor(94, 314)}
        <rect x="188" y="86" width="24" height="24" rx="6" fill="#F08000" />
        <path d="M200 110v22" stroke="#7C8394" strokeWidth="5" />
        <rect x="140" y="132" width="120" height="86" rx="16" fill="#4E7FA6" />
        <rect x="140" y="132" width="120" height="20" rx="10" fill="#6B9BC0" />
        <circle cx="174" cy="176" r="16" fill="#F5F9FC" />
        <circle cx="174" cy="176" r="7" fill="#2F3644" />
        <circle cx="226" cy="176" r="16" fill="#F5F9FC" />
        <circle cx="226" cy="176" r="7" fill="#2F3644" />
        <rect x="176" y="200" width="48" height="7" rx="3.5" fill="#2F3644" opacity="0.6" />
        <rect x="152" y="226" width="96" height="70" rx="12" fill="#2F3644" />
        <circle cx="200" cy="258" r="26" fill="#9AA2B2" />
        <circle cx="200" cy="258" r="11" fill="#4B5163" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
          <rect key={d} x="196" y="228" width="8" height="12" rx="3" fill="#9AA2B2" transform={`rotate(${d} 200 258)`} />
        ))}
        <rect x="106" y="232" width="42" height="18" rx="9" fill="#6B9BC0" />
        <rect x="252" y="232" width="42" height="18" rx="9" fill="#6B9BC0" />
        <rect x="160" y="296" width="30" height="14" rx="6" fill="#F08000" />
        <rect x="210" y="296" width="30" height="14" rx="6" fill="#F08000" />
      </>
    ),
  },
  t5: {
    bg: ["#FDF4E6", "#F8E0BC"],
    art: (
      <>
        {floor(92, 314)}
        <ellipse cx="200" cy="256" rx="72" ry="56" fill="#E8951E" />
        <ellipse cx="200" cy="266" rx="44" ry="38" fill="#F5EEDF" />
        {[-58, -46, 46, 58].map((dx) => (
          <path key={dx} d={`M${200 + dx} 226q9 20 0 40`} stroke="#C4740E" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.85" />
        ))}
        <circle cx="152" cy="130" r="22" fill="#E8951E" />
        <circle cx="152" cy="130" r="11" fill="#C4506F" opacity="0.6" />
        <circle cx="248" cy="130" r="22" fill="#E8951E" />
        <circle cx="248" cy="130" r="11" fill="#C4506F" opacity="0.6" />
        <circle cx="200" cy="160" r="60" fill="#F0A72E" />
        <path d="M170 112q8 20 0 34" stroke="#5A3B12" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M230 112q-8 20 0 34" stroke="#5A3B12" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="200" cy="184" rx="34" ry="26" fill="#F5EEDF" />
        <circle cx="180" cy="152" r="8" fill="#2F3644" />
        <circle cx="220" cy="152" r="8" fill="#2F3644" />
        <path d="M200 174l-10 8h20z" fill="#2F3644" />
        <path d="M200 182v8" stroke="#2F3644" strokeWidth="3" />
        <path d="M186 194q14 12 28 0" stroke="#2F3644" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <ellipse cx="126" cy="272" rx="24" ry="18" fill="#E8951E" transform="rotate(-18 126 272)" />
        <ellipse cx="274" cy="272" rx="24" ry="18" fill="#E8951E" transform="rotate(18 274 272)" />
      </>
    ),
  },
};
