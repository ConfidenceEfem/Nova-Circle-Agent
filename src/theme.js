// Nova Circle Agent design tokens — "mission control for an options agent".
// Deep space purple/black base, with an orbital-ring / nova-burst motif
// used throughout for signals, confidence, and agent status.

export const colors = {
  void: '#08060C',          // page background
  panel: '#130E1A',         // card / panel background
  panelRaised: '#1C1526',   // hovered / raised panel
  stroke: '#2A2233',        // hairline borders

  nova: '#3D1768',          // brand purple (given)
  novaBright: '#8B5CF6',    // brighter tint — glows, active states, links
  novaDim: '#241040',       // low-value purple fill

  gold: '#F5B841',          // "buy premium" / opportunity signal
  goldDim: '#4A3A17',

  paper: '#F1ECF7',         // primary text
  muted: '#9A93A8',         // secondary text
  faint: '#5C5468',         // tertiary / disabled

  up: '#33D17A',            // positive P&L
  down: '#FF5C5C',          // negative P&L
};

export const font = {
  display: `'Orbitron', 'Arial Narrow', sans-serif`, // headlines, agent identity
  body: `'Inter', -apple-system, sans-serif`,          // reading face
  mono: `'JetBrains Mono', 'SFMono-Regular', monospace`, // prices, tickers, data
};

export const radius = {
  sm: '4px',
  md: '10px',
  lg: '18px',
  pill: '999px',
};

export const shadow = {
  card: '0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 28px rgba(0,0,0,0.45)',
  glow: '0 0 0 1px rgba(139,92,246,0.35), 0 0 28px rgba(139,92,246,0.14)',
};
