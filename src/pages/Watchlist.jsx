import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Page, PageHead, Title, Sub, Panel } from '../components/Layout';
import { Mono, SignalBadge, OrbitRing } from '../components/Atoms';
import { LoadingState, ErrorState } from '../components/AsyncStates';
import { colors, font } from '../theme';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  font-family: ${font.mono};
  font-size: 11.5px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? colors.novaBright : colors.stroke)};
  background: ${(p) => (p.$active ? 'rgba(139,92,246,0.12)' : 'transparent')};
  color: ${(p) => (p.$active ? colors.novaBright : colors.muted)};
  &:hover { color: ${colors.novaBright}; border-color: ${colors.novaBright}; }
`;

const HeadRow = styled.div`
  display: grid;
  grid-template-columns: 44px 1.6fr 1fr 0.8fr 0.8fr 0.8fr 90px 24px;
  gap: 10px;
  padding: 12px 18px;
  font-family: ${font.mono};
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colors.faint};

  @media (max-width: 900px) { display: none; }
`;

const Row = styled(Link)`
  display: grid;
  grid-template-columns: 44px 1.6fr 1fr 0.8fr 0.8fr 0.8fr 90px 24px;
  gap: 10px;
  align-items: center;
  padding: 14px 18px;
  border-top: 1px solid ${colors.stroke};
  &:hover { background: ${colors.panelRaised}; }

  @media (max-width: 900px) {
    grid-template-columns: 40px 1fr auto;
  }
`;

const TickerCol = styled.div`
  display: flex;
  flex-direction: column;
  b { font-size: 13.5px; color: ${colors.paper}; }
  small { font-family: ${font.mono}; font-size: 10.5px; color: ${colors.faint}; }
`;

const Hide = styled.span`
  @media (max-width: 900px) { display: none; }
`;

const signalRingColor = (signal) => (signal === 'sell_premium' ? colors.novaBright : signal === 'buy_premium' ? colors.gold : colors.faint);

const filters = [
  { id: 'all', label: 'All' },
  { id: 'sell_premium', label: 'Sell premium' },
  { id: 'buy_premium', label: 'Buy premium' },
  { id: 'no_edge', label: 'No edge' },
];

export default function Watchlist() {
  const [filter, setFilter] = useState('all');
  const { data: watchlist, loading, error, refetch } = useApi(api.getWatchlist, []);

  const rows = useMemo(() => {
    if (!watchlist) return [];
    return watchlist.filter((w) => filter === 'all' || w.signal === filter).sort((a, b) => b.confidence - a.confidence);
  }, [watchlist, filter]);

  if (loading) return <Page><LoadingState label="Scanning watchlist…" /></Page>;
  if (error) return <Page><ErrorState error={error} onRetry={refetch} /></Page>;

  return (
    <Page>
      <PageHead>
        <div>
          <Title>Watchlist</Title>
          <Sub>{watchlist.length} stocks monitored for upcoming earnings · scanned every 15 minutes</Sub>
        </div>
      </PageHead>

      <FilterBar>
        {filters.map((f) => (
          <Tab key={f.id} $active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Tab>
        ))}
      </FilterBar>

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <HeadRow>
          <span>Conf.</span>
          <span>Ticker</span>
          <span>Earnings</span>
          <span>Implied</span>
          <span>Historical</span>
          <span>Ratio</span>
          <span>Signal</span>
          <span />
        </HeadRow>
        {rows.length ? (
          rows.map((w) => (
            <Row to={`/signal/${w.ticker}`} key={w.ticker}>
              <OrbitRing size={34} stroke={3} pct={w.confidence} color={signalRingColor(w.signal)} value={w.confidence} />
              <TickerCol>
                <b>${w.ticker}</b>
                <small>{w.company}</small>
              </TickerCol>
              <Hide><Mono style={{ fontSize: 12.5, color: colors.muted }}>{w.earningsDate} · {w.earningsTime}</Mono></Hide>
              <Hide><Mono style={{ fontSize: 12.5, color: colors.paper }}>{w.impliedMove}%</Mono></Hide>
              <Hide><Mono style={{ fontSize: 12.5, color: colors.muted }}>{w.historicalMove}%</Mono></Hide>
              <Mono style={{ fontSize: 12.5, color: colors.paper }}>{w.ratio != null ? w.ratio.toFixed(2) : '—'}</Mono>
              <SignalBadge $signal={w.signal}>{w.signal.replace('_', ' ')}</SignalBadge>
              <ChevronRight size={15} color={colors.faint} />
            </Row>
          ))
        ) : (
          <p style={{ padding: '20px 18px', color: colors.faint, fontFamily: font.mono, fontSize: 13 }}>
            No tickers match this filter right now.
          </p>
        )}
      </Panel>
    </Page>
  );
}
