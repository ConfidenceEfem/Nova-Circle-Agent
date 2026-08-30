import styled from 'styled-components';
import { colors, font, radius } from '../theme';

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${font.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.faint};
`;

export const Mono = styled.span`
  font-family: ${font.mono};
  font-variant-numeric: tabular-nums;
`;

export const PL = styled.span`
  font-family: ${font.mono};
  font-weight: 600;
  color: ${(p) => (p.$value >= 0 ? colors.up : colors.down)};

  &::before {
    content: '${(p) => (p.$value >= 0 ? '+' : '')}';
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${font.body};
  font-weight: 700;
  font-size: 13.5px;
  padding: ${(p) => (p.$sm ? '8px 14px' : '12px 20px')};
  border-radius: ${radius.md};
  border: 1px solid transparent;
  transition: transform 0.12s ease, filter 0.12s ease, background 0.12s ease;

  ${(p) =>
    p.$variant === 'ghost'
      ? `
    background: transparent;
    border-color: ${colors.stroke};
    color: ${colors.paper};
    &:hover { border-color: ${colors.novaBright}; color: ${colors.novaBright}; }
  `
      : p.$variant === 'outline'
      ? `
    background: rgba(139,92,246,0.08);
    border-color: rgba(139,92,246,0.4);
    color: ${colors.novaBright};
    &:hover { background: rgba(139,92,246,0.16); }
  `
      : p.$variant === 'danger'
      ? `
    background: transparent;
    border-color: rgba(255,92,92,0.4);
    color: ${colors.down};
    &:hover { background: rgba(255,92,92,0.1); }
  `
      : `
    background: linear-gradient(135deg, ${colors.novaBright}, ${colors.nova});
    color: ${colors.paper};
    &:hover { filter: brightness(1.12); transform: translateY(-1px); }
    &:active { transform: translateY(0); }
  `}

  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`;

// Signal badge — the core "what should I do about this stock" indicator.
const SIGNAL_META = {
  sell_premium: { label: 'Sell premium', color: colors.novaBright, bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.4)' },
  buy_premium: { label: 'Buy premium', color: colors.gold, bg: 'rgba(245,184,65,0.12)', border: 'rgba(245,184,65,0.4)' },
  no_edge: { label: 'No edge', color: colors.faint, bg: 'rgba(154,147,168,0.08)', border: colors.stroke },
};
export const signalMeta = (signal) => SIGNAL_META[signal] || SIGNAL_META.no_edge;

export const SignalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${font.mono};
  font-size: 11px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: ${radius.pill};
  color: ${(p) => signalMeta(p.$signal).color};
  background: ${(p) => signalMeta(p.$signal).bg};
  border: 1px solid ${(p) => signalMeta(p.$signal).border};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`;

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${font.mono};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 5px 10px;
  border-radius: ${radius.pill};
  color: ${(p) => (p.$ok ? colors.up : colors.down)};
  background: ${(p) => (p.$ok ? 'rgba(51,209,122,0.1)' : 'rgba(255,92,92,0.1)')};
  border: 1px solid ${(p) => (p.$ok ? 'rgba(51,209,122,0.35)' : 'rgba(255,92,92,0.35)')};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`;

// Orbit ring — a small circular progress gauge used for confidence scores
// and the implied/historical move ratio. This is the recurring "mission
// control" motif across the app.
const RingWrap = styled.div`
  position: relative;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const RingCenter = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  b {
    font-family: ${font.mono};
    font-size: ${(p) => p.$fontSize || '14px'};
    color: ${colors.paper};
    line-height: 1;
  }
  small {
    font-size: 8px;
    color: ${colors.faint};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-top: 2px;
  }
`;

export function OrbitRing({ size = 56, stroke = 5, pct, color = colors.novaBright, label, value }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;

  return (
    <RingWrap $size={size}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors.stroke} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <RingCenter $fontSize={size >= 56 ? '14px' : '11px'}>
        <b>{value}</b>
        {label && <small>{label}</small>}
      </RingCenter>
    </RingWrap>
  );
}

export const PulseDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$on ? colors.up : colors.faint)};
  animation: ${(p) => (p.$on ? 'pulseRing 2s infinite' : 'none')};
`;

export const Divider = styled.div`
  height: 1px;
  background: ${colors.stroke};
  width: 100%;
`;
