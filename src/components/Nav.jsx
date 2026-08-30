import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Orbit, Play, Pause } from 'lucide-react';
import { colors, font, radius } from '../theme';
import { PulseDot } from './Atoms';
import { useAgent } from '../context/AgentContext';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 28px;
  background: rgba(8, 6, 12, 0.86);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${colors.stroke};

  @media (max-width: 900px) {
    padding: 12px 16px;
    gap: 12px;
  }
`;

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;

  svg { color: ${colors.novaBright}; }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;

  b {
    font-family: ${font.display};
    font-size: 17px;
    letter-spacing: 0.04em;
    color: ${colors.paper};
  }
  small {
    font-family: ${font.mono};
    font-size: 9px;
    letter-spacing: 0.2em;
    color: ${colors.faint};
    margin-top: 3px;
  }
`;

const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  font-size: 13px;
  font-weight: 600;
  padding: 8px 13px;
  border-radius: ${radius.pill};
  color: ${colors.muted};

  &:hover { color: ${colors.paper}; }
  &.active {
    color: ${colors.paper};
    background: rgba(139,92,246,0.16);
    box-shadow: inset 0 0 0 1px rgba(139,92,246,0.4);
  }
`;

const AgentToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px 7px 10px;
  border-radius: ${radius.pill};
  border: 1px solid ${(p) => (p.$on ? 'rgba(51,209,122,0.35)' : colors.stroke)};
  background: ${(p) => (p.$on ? 'rgba(51,209,122,0.08)' : colors.panel)};
  color: ${(p) => (p.$on ? colors.up : colors.faint)};
  font-family: ${font.mono};
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:hover { filter: brightness(1.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ConnBadge = styled.span`
  font-family: ${font.mono};
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 9px;
  border-radius: ${radius.pill};
  color: ${(p) => (p.$ok ? colors.gold : colors.down)};
  background: ${(p) => (p.$ok ? 'rgba(245,184,65,0.1)' : 'rgba(255,92,92,0.1)')};
  border: 1px solid ${(p) => (p.$ok ? 'rgba(245,184,65,0.35)' : 'rgba(255,92,92,0.35)')};

  @media (max-width: 700px) { display: none; }
`;

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/positions', label: 'Positions' },
  { to: '/history', label: 'History' },
  { to: '/risk', label: 'Risk Gates' },
  { to: '/account', label: 'Account' },
];

export default function Nav() {
  const { running, toggle, connected, demoMode, busy } = useAgent();

  return (
    <Bar>
      <Logo to="/" end>
        <Orbit size={24} strokeWidth={2} />
        <LogoText>
          <b>NOVA CIRCLE</b>
          <small>AGENT</small>
        </LogoText>
      </Logo>
      <Links>
        {links.map((l) => (
          <NavItem key={l.to} to={l.to} end={l.end}>
            {l.label}
          </NavItem>
        ))}
      </Links>
      {!connected ? (
        <ConnBadge $ok={false}>Backend offline</ConnBadge>
      ) : demoMode ? (
        <ConnBadge $ok>Demo data</ConnBadge>
      ) : null}
      <AgentToggle $on={running} onClick={toggle} disabled={busy || !connected}>
        <PulseDot $on={running} />
        {running ? <Play size={12} /> : <Pause size={12} />}
        {running ? 'Agent running' : 'Agent paused'}
      </AgentToggle>
    </Bar>
  );
}
