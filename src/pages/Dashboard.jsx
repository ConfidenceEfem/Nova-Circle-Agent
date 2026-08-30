import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Radar, Zap, CircleSlash } from 'lucide-react';
import { Page, Section, SectionHead, SectionTitle, Grid, StatCard, StatLabel, StatValue, StatSub, Panel } from '../components/Layout';
import { Eyebrow, Mono, PL, SignalBadge, StatusPill, OrbitRing, Button } from '../components/Atoms';
import { LoadingState, ErrorState } from '../components/AsyncStates';
import { colors, font } from '../theme';
import { api } from '../api/client';
import { useApi } from '../api/useApi';
import { useAgent } from '../context/AgentContext';
import { timeAgo } from '../utils/timeAgo';

const Hero = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const Headline = styled.h1`
  font-size: 32px;
  color: ${colors.paper};
`;

const CurveWrap = styled(Panel)`
  padding: 20px 22px;
`;

const CurveSvg = ({ data }) => {
  const values = data.map((d) => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100;
  const h = 32;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="90" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={colors.novaBright} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const SignalRow = styled(Link)`
  display: grid;
  grid-template-columns: 30px 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid ${colors.stroke};
  &:last-child { border-bottom: none; }
  &:hover { background: ${colors.panelRaised}; }
`;

const TickerCol = styled.div`
  display: flex;
  flex-direction: column;
  b { font-size: 13.5px; color: ${colors.paper}; }
  small { font-family: ${font.mono}; font-size: 10.5px; color: ${colors.faint}; }
`;

const LogRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid ${colors.stroke};
  &:last-child { border-bottom: none; }
`;

const LogIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.panelRaised};
  color: ${(p) => p.$color};
`;

const LogBody = styled.div`
  flex: 1;
  b { font-family: ${font.mono}; font-size: 12px; color: ${colors.paper}; }
  p { font-size: 12.5px; color: ${colors.muted}; margin-top: 2px; line-height: 1.4; }
  span { font-family: ${font.mono}; font-size: 10.5px; color: ${colors.faint}; }
`;

const logIcon = (action) => {
  if (action === 'entered') return { Icon: Zap, color: colors.up };
  if (action === 'skipped') return { Icon: CircleSlash, color: colors.faint };
  return { Icon: Radar, color: colors.novaBright };
};

export default function Dashboard() {
  const { running, lastScan, scanNow, busy } = useAgent();
  const { data: account, loading: accountLoading, error: accountError, refetch: refetchAccount } = useApi(api.getAccount, []);
  const { data: watchlist, loading: watchlistLoading, error: watchlistError } = useApi(api.getWatchlist, []);
  const { data: activityLog, loading: activityLoading } = useApi(() => api.getActivity(), []);

  if (accountLoading || watchlistLoading) return <Page><LoadingState label="Loading mission control…" /></Page>;
  if (accountError) return <Page><ErrorState error={accountError} onRetry={refetchAccount} /></Page>;

  const topSignals = watchlist ? [...watchlist].sort((a, b) => b.confidence - a.confidence).slice(0, 5) : [];

  return (
    <Page>
      <Hero>
        <div>
          <Eyebrow><Radar size={12} /> {running ? `Last scan ${lastScan}` : 'Agent paused'}</Eyebrow>
          <Headline style={{ marginTop: 8 }}>Mission control</Headline>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusPill $ok={account.status === 'connected'}>
            {account.status === 'connected' ? 'Alpaca connected' : 'Disconnected'}
          </StatusPill>
          <Button $sm $variant="outline" onClick={scanNow} disabled={busy}>Scan now</Button>
        </div>
      </Hero>

      <Section $mt="26px">
        <Grid $cols={4}>
          <StatCard>
            <StatLabel>Equity</StatLabel>
            <StatValue>${account.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</StatValue>
            <StatSub><PL $value={account.dayPL}>${Math.abs(account.dayPL).toFixed(2)} today</PL></StatSub>
          </StatCard>
          <StatCard>
            <StatLabel>Total P&amp;L</StatLabel>
            <StatValue><PL $value={account.totalPL}>${Math.abs(account.totalPL).toFixed(2)}</PL></StatValue>
            <StatSub style={{ color: colors.faint }}>{account.totalPLPct}% since $100,000 start</StatSub>
          </StatCard>
          <StatCard>
            <StatLabel>Buying power</StatLabel>
            <StatValue>${account.buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2 })}</StatValue>
            <StatSub style={{ color: colors.faint }}>Cash ${account.cash.toLocaleString()}</StatSub>
          </StatCard>
          <StatCard>
            <StatLabel>Open positions</StatLabel>
            <StatValue as={Link} to="/positions" style={{ color: colors.paper }}>View</StatValue>
            <StatSub as={Link} to="/positions" style={{ color: colors.novaBright }}>Details <ArrowUpRight size={11} style={{ verticalAlign: -1 }} /></StatSub>
          </StatCard>
        </Grid>
      </Section>

      <Section>
        <SectionHead>
          <SectionTitle>Equity curve</SectionTitle>
          <Eyebrow>Since account funded</Eyebrow>
        </SectionHead>
        <CurveWrap>
          <CurveSvg data={account.equityCurve} />
        </CurveWrap>
      </Section>

      <Grid $cols={2} $gap="24px" style={{ marginTop: 40, alignItems: 'start' }}>
        <Section $mt="0">
          <SectionHead>
            <SectionTitle>Top signals right now</SectionTitle>
            <Link to="/watchlist" style={{ fontFamily: font.mono, fontSize: 11, color: colors.faint }}>Full watchlist <ArrowUpRight size={10} /></Link>
          </SectionHead>
          <Panel style={{ padding: '4px 18px' }}>
            {watchlistError ? (
              <p style={{ padding: '18px 0', color: colors.down, fontSize: 12.5 }}>{watchlistError}</p>
            ) : topSignals.length ? (
              topSignals.map((t) => (
                <SignalRow to={`/signal/${t.ticker}`} key={t.ticker}>
                  <OrbitRing size={30} stroke={3} pct={t.confidence} color={signalRingColor(t.signal)} value="" />
                  <TickerCol>
                    <b>${t.ticker}</b>
                    <small>{t.company}</small>
                  </TickerCol>
                  <Mono style={{ fontSize: 12, color: colors.muted }}>ratio {t.ratio != null ? t.ratio.toFixed(2) : '—'}</Mono>
                  <SignalBadge $signal={t.signal}>{t.signal.replace('_', ' ')}</SignalBadge>
                </SignalRow>
              ))
            ) : (
              <p style={{ padding: '18px 0', color: colors.faint, fontSize: 12.5 }}>No tickers with upcoming earnings right now.</p>
            )}
          </Panel>
        </Section>

        <Section $mt="0">
          <SectionHead>
            <SectionTitle>Agent activity</SectionTitle>
            <Eyebrow>Live decision trace</Eyebrow>
          </SectionHead>
          <Panel style={{ padding: '4px 18px' }}>
            {activityLoading ? (
              <p style={{ padding: '18px 0', color: colors.faint, fontSize: 12.5 }}>Loading…</p>
            ) : activityLog && activityLog.length ? (
              activityLog.slice(0, 6).map((a) => {
                const { Icon, color } = logIcon(a.action);
                return (
                  <LogRow key={a.id}>
                    <LogIcon $color={color}><Icon size={13} /></LogIcon>
                    <LogBody>
                      <b>${a.ticker}</b> <span>· {timeAgo(a.time)}</span>
                      <p>{a.summary}</p>
                    </LogBody>
                  </LogRow>
                );
              })
            ) : (
              <p style={{ padding: '18px 0', color: colors.faint, fontSize: 12.5 }}>No activity logged yet — try "Scan now" above.</p>
            )}
          </Panel>
        </Section>
      </Grid>
    </Page>
  );
}

function signalRingColor(signal) {
  if (signal === 'sell_premium') return colors.novaBright;
  if (signal === 'buy_premium') return colors.gold;
  return colors.faint;
}
