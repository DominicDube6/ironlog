import { ChevronsDown, TrendingDown, ArrowUp, ArrowDown, Footprints, RotateCcw } from "lucide-react";

const PATTERN_ICON = {
  squat: ChevronsDown,
  hinge: TrendingDown,
  push: ArrowUp,
  pull: ArrowDown,
  lunge: Footprints,
  isolation: RotateCcw,
};

export function PatternIcon({ pattern, size = 16, color = "#7FA8C9" }) {
  const Icon = PATTERN_ICON[pattern] || RotateCcw;
  return <Icon size={size} color={color} strokeWidth={2.5} />;
}

export function StickFigure({ pattern, size = 64 }) {
  const stroke = "#EDEAE3";
  const bar = "#C9A227";
  const common = { fill: "none", stroke, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };

  const figures = {
    squat: (
      <>
        <circle cx="30" cy="10" r="5" fill={stroke} />
        <line x1="20" y1="15" x2="40" y2="15" stroke={bar} strokeWidth="4" strokeLinecap="round" />
        <path d="M30 15 L30 34" {...common} />
        <path d="M30 34 L20 48 L18 66" {...common} />
        <path d="M30 34 L40 48 L42 66" {...common} />
        <path d="M30 16 L20 15" {...common} />
        <path d="M30 16 L40 15" {...common} />
      </>
    ),
    hinge: (
      <>
        <circle cx="14" cy="12" r="5" fill={stroke} />
        <path d="M16 16 L34 38" {...common} />
        <path d="M34 38 L34 55 L34 70" {...common} />
        <path d="M18 18 L22 50" {...common} />
        <line x1="14" y1="50" x2="28" y2="50" stroke={bar} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    push: (
      <>
        <circle cx="30" cy="10" r="5" fill={stroke} />
        <path d="M30 15 L30 40" {...common} />
        <path d="M30 16 L18 4" {...common} />
        <path d="M30 16 L42 4" {...common} />
        <line x1="16" y1="3" x2="44" y2="3" stroke={bar} strokeWidth="4" strokeLinecap="round" />
        <path d="M30 40 L22 70" {...common} />
        <path d="M30 40 L38 70" {...common} />
      </>
    ),
    pull: (
      <>
        <circle cx="14" cy="12" r="5" fill={stroke} />
        <path d="M16 16 L34 38" {...common} />
        <path d="M34 38 L34 70" {...common} />
        <path d="M18 19 L10 28 L24 32" {...common} />
        <line x1="16" y1="32" x2="30" y2="32" stroke={bar} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    lunge: (
      <>
        <circle cx="26" cy="8" r="5" fill={stroke} />
        <path d="M26 13 L26 34" {...common} />
        <path d="M26 34 L38 50 L46 66" {...common} />
        <path d="M26 34 L14 52 L10 70" {...common} />
        <path d="M26 16 L18 34" {...common} />
        <path d="M26 16 L34 34" {...common} />
        <circle cx="18" cy="35" r="2.5" fill={bar} />
        <circle cx="34" cy="35" r="2.5" fill={bar} />
      </>
    ),
    isolation: (
      <>
        <circle cx="30" cy="8" r="5" fill={stroke} />
        <path d="M30 13 L30 42" {...common} />
        <path d="M30 42 L24 70" {...common} />
        <path d="M30 42 L36 70" {...common} />
        <path d="M22 16 L20 34" {...common} />
        <path d="M38 16 L40 28 L34 18" {...common} />
        <circle cx="34" cy="18" r="3" fill={bar} />
      </>
    ),
  };

  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 60 76">
      {figures[pattern] || figures.isolation}
    </svg>
  );
}
