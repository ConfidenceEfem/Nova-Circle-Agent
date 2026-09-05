import { useState } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Gauge } from 'lucide-react';
import { Page, Section, SectionHead, SectionTitle, Grid, Panel, StatLabel } from '../components/Layout';
import { Eyebrow, Mono, SignalBadge, OrbitRing, Button } from '../components/Atoms';
import { LoadingState, ErrorState } from '../components/AsyncStates';
import { colors, font } from '../theme';
import { api } from '../api/client';
import { useApi } from '../api/useApi';
import { timeAgo } from '../utils/timeAgo';

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${font.mono};
  font-size: 12px;
  color: ${colors.faint};
  margin-bottom: 18px;
  &:hover { color: ${colors.novaBright}; }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const TickerName = styled.h1`
  font-size: 34px;
  color: ${colors.paper};
`;

const Company = styled.p`
  color: ${colors.muted};
  font-size: 13.5px;
  margin-top: 4px;
`;

const ReasonBox = styled(Panel)`
  border-left: 3px solid ${(p) => p.$color};
`;

const ReasonText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.paper};
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid ${colors.stroke};
  font-size: 13.5px;
  &:last-child { border-bottom: none; }
  span:first-child { color: ${colors.faint}; }
  span:last-child { font-family: ${font.mono}; color: ${colors.paper}; }
`;

const LegRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.stroke};
  font-family: ${font.mono};
  font-size: 12.5px;
  &:last-child { border-bottom: none; }
`;

const PreviewBox = styled.div`
  margin-top: 14px;
  padding: 14px;
  background: ${colors.panelRaised};
  border-radius: 10px;
`;

const signalCopy = {
  sell_premium: {
    color: colors.novaBright,
    text: (w, risk) => `The options market is pricing in a ${w.impliedMove}% move for ${w.ticker}'s earnings, well above its historical average move of ${w.historicalMove}% — a ratio of ${w.ratio?.toFixed(2)}. That's above the ${risk.sellPremiumThreshold} sell-premium threshold, meaning the market looks like it's overpricing the risk. The agent favors selling premium here (an iron condor) rather than buying it.`,
    strategy: 'Iron Condor',
    icon: TrendingDown,
  },
  buy_premium: {
    color: colors.gold,
    text: (w, risk) => `The options market is only pricing in a ${w.impliedMove}% move for ${w.ticker}'s earnings, below its historical average move of ${w.historicalMove}% — a ratio of ${w.ratio?.toFixed(2)}. That's below the ${risk.buyPremiumThreshold} buy-premium threshold, meaning the market may be underpricing the risk. The agent favors buying premium here (a long strangle) to benefit if the move is bigger than priced in.`,
    strategy: 'Long Strangle',
    icon: TrendingUp,
  },
  no_edge: {
    color: colors.faint,
    text: (w, risk) => `${w.ticker}'s implied move (${w.impliedMove}%) is close to its historical average (${w.historicalMove}%) — a ratio of ${w.ratio?.toFixed(2)}, inside the no-edge band (${risk.buyPremiumThreshold}–${risk.sellPremiumThreshold}). The pricing looks fair, so the agent has no edge to trade here and will keep scanning.`,
    strategy: null,
    icon: Gauge,
  },
};

export default function SignalDetail() {
  const { ticker } = useParams();

  // Every hook lives here, before ANY early return below — this is the
  // part that broke last time. React requires hooks to run in the exact
  // same order on every render; a hook declared after a conditional
  // `return` works fine right up until the render path changes (e.g.
  // loading finishes), at which point React's internal bookkeeping breaks
  // and the whole tree unmounts silently. All state, always at the top.
  const { data: stock, loading, error, refetch } = useApi(() => api.getWatchlistTicker(ticker), [ticker]);
  const { data: risk } = useApi(api.getRiskSettings, []);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [placing, setPlacing] = useState(false);

  if (loading || !risk) return <Page><LoadingState label={`Loading ${ticker}…`} /></Page>;
  if (error) return <Page><ErrorState error={error} onRetry={refetch} /></Page>;

  const copy = signalCopy[stock.signal];
  const Icon = copy.icon;
  const trace = stock.trace || [];

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const result = await api.previewOrder(stock.ticker);
      setPreview(result);
    } catch (err) {
      alert(`Preview failed: ${err.message}`);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePlace = async () => {
    if (!confirm(`Place a real ${preview.strategy} on ${stock.ticker}? This sends a real order to your connected Alpaca account.`)) return;
    setPlacing(true);
    try {
      const result = await api.placeOrder(stock.ticker);
      alert(`Order placed: ${result.orderId || 'submitted'}`);
      setPreview(null);
    } catch (err) {
      alert(`Order failed: ${err.message}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Page>
      <Back to="/watchlist"><ArrowLeft size={13} /> Back to watchlist</Back>

      <Head>
        <OrbitRing size={64} stroke={5} pct={stock.confidence} color={copy.color} value={stock.confidence} label="conf." />
        <div>
          <TickerName>${stock.ticker}</TickerName>
          <Company>{stock.company} · {stock.sector}</Company>
        </div>
        <SignalBadge $signal={stock.signal} style={{ marginLeft: 'auto' }}>{stock.signal.replace('_', ' ')}</SignalBadge>
      </Head>

      <Section>
        <ReasonBox $color={copy.color}>
          <Eyebrow><Icon size={12} /> Agent reasoning</Eyebrow>
          <ReasonText style={{ marginTop: 10 }}>{copy.text(stock, risk)}</ReasonText>
        </ReasonBox>
      </Section>

      <Grid $cols={2} $gap="24px" style={{ marginTop: 32, alignItems: 'start' }}>
        <Section $mt="0">
          <SectionHead><SectionTitle>Signal inputs</SectionTitle></SectionHead>
          <Panel>
            <MetricRow><span>Current price</span><span>{stock.price != null ? `$${stock.price}` : '—'}</span></MetricRow>
            <MetricRow><span>Earnings date</span><span>{stock.earningsDate ? `${stock.earningsDate} (${stock.earningsTime})` : '—'}</span></MetricRow>
            <MetricRow><span>Implied move</span><span>{stock.impliedMove != null ? `${stock.impliedMove}%` : '—'}</span></MetricRow>
            <MetricRow><span>Historical avg. move</span><span>{stock.historicalMove != null ? `${stock.historicalMove}%` : '—'}</span></MetricRow>
            <MetricRow><span>Ratio (implied ÷ historical)</span><span>{stock.ratio != null ? stock.ratio.toFixed(2) : '—'}</span></MetricRow>
            <MetricRow><span>Confidence score</span><span>{stock.confidence}/100</span></MetricRow>
            <MetricRow><span>Last scanned</span><span>{stock.lastScanned}</span></MetricRow>
          </Panel>
        </Section>

        <Section $mt="0">
          <SectionHead><SectionTitle>{copy.strategy ? 'Proposed structure' : 'Decision trace'}</SectionTitle></SectionHead>
          <Panel>
            {copy.strategy ? (
              <>
                <StatLabel style={{ marginBottom: 10 }}>{copy.strategy} · exp. nearest post-earnings</StatLabel>

                <Button style={{ width: '100%' }} $sm onClick={handlePreview} disabled={previewLoading}>
                  {previewLoading ? 'Loading real quotes…' : 'Preview order'}
                </Button>

                {preview && (
                  <PreviewBox>
                    {preview.usingDemoData && (
                      <p style={{ color: colors.down, fontSize: 12, marginBottom: 8 }}>
                        Real options data isn't available right now — this preview is using demo data and can't be placed for real.
                      </p>
                    )}
                    {preview.legs.map((l, i) => (
                      <LegRow key={i}>
                        <span>{l.side.toUpperCase()} {l.type.toUpperCase()} {l.strike} ({l.symbol})</span>
                        <span>{l.price != null ? `$${l.price}` : 'no quote'}</span>
                      </LegRow>
                    ))}
                    {preview.netPrice != null && (
                      <p style={{ marginTop: 8, fontSize: 13, color: colors.paper }}>
                        Net {preview.netType}: ${Math.abs(preview.netPrice).toFixed(2)} per spread
                      </p>
                    )}
                    <Button
                      style={{ width: '100%', marginTop: 10 }}
                      $sm
                      onClick={handlePlace}
                      disabled={placing || preview.usingDemoData || !preview.priceable}
                    >
                      {placing ? 'Placing…' : 'Place this order for real'}
                    </Button>
                  </PreviewBox>
                )}
              </>
            ) : (
              <p style={{ fontSize: 13, color: colors.muted, lineHeight: 1.6 }}>
                No structure proposed — ratio is inside the no-edge band. The agent will re-scan this ticker on its next cycle.
              </p>
            )}
          </Panel>
        </Section>
      </Grid>

      <Section>
        <SectionHead><SectionTitle>History for ${stock.ticker}</SectionTitle></SectionHead>
        <Panel style={{ padding: '4px 18px' }}>
          {trace.length ? (
            trace.map((a) => (
              <MetricRow key={a.id}>
                <span>{timeAgo(a.time)} · {a.action}</span>
                <span style={{ maxWidth: '60%', textAlign: 'right', whiteSpace: 'normal' }}>{a.summary}</span>
              </MetricRow>
            ))
          ) : (
            <p style={{ padding: '14px 0', color: colors.faint, fontSize: 13 }}>No recent activity logged for this ticker.</p>
          )}
        </Panel>
      </Section>
    </Page>
  );
}