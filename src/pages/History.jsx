import styled from 'styled-components';
import { Page, PageHead, Title, Sub, Grid, StatCard, StatLabel, StatValue, Panel } from '../components/Layout';
import { Mono, PL, StatusPill } from '../components/Atoms';
import { LoadingState, ErrorState } from '../components/AsyncStates';
import { colors, font } from '../theme';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const HeadRow = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr 1fr 1fr 100px 110px;
  gap: 10px;
  padding: 12px 18px;
  font-family: ${font.mono};
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${colors.faint};

  @media (max-width: 800px) { display: none; }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr 1fr 1fr 100px 110px;
  gap: 10px;
  align-items: center;
  padding: 13px 18px;
  border-top: 1px solid ${colors.stroke};

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
    row-gap: 4px;
  }
`;

const exitLabel = { profit_target: 'Profit target', stop_loss: 'Stop loss', time_exit: 'Time exit', manual: 'Manual close' };

export default function History() {
  const { data: tradeHistory, loading, error, refetch } = useApi(api.getHistory, []);

  if (loading) return <Page><LoadingState label="Loading trade history…" /></Page>;
  if (error) return <Page><ErrorState error={error} onRetry={refetch} /></Page>;

  const wins = tradeHistory.filter((t) => t.outcome === 'win').length;
  const total = tradeHistory.length;
  const winRate = total ? Math.round((wins / total) * 100) : 0;
  const totalPL = tradeHistory.reduce((sum, t) => sum + t.pl, 0);

  return (
    <Page>
      <PageHead>
        <div>
          <Title>Trade history</Title>
          <Sub>{total} closed trades this competition window</Sub>
        </div>
      </PageHead>

      <Grid $cols={3} $gap="18px" style={{ marginBottom: 30 }}>
        <StatCard>
          <StatLabel>Win rate</StatLabel>
          <StatValue>{winRate}%</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Closed P&amp;L</StatLabel>
          <StatValue><PL $value={totalPL}>${Math.abs(totalPL).toFixed(2)}</PL></StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Trades closed</StatLabel>
          <StatValue>{total}</StatValue>
        </StatCard>
      </Grid>

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <HeadRow>
          <span>Ticker</span>
          <span>Strategy</span>
          <span>Entry → Exit</span>
          <span>Exit reason</span>
          <span>Outcome</span>
          <span>P&amp;L</span>
        </HeadRow>
        {total ? (
          tradeHistory.map((t) => (
            <Row key={t.id}>
              <Mono style={{ color: colors.paper, fontWeight: 600 }}>${t.ticker}</Mono>
              <span style={{ fontSize: 13, color: colors.muted }}>{t.strategy}</span>
              <Mono style={{ fontSize: 12, color: colors.muted }}>{t.entryDate} → {t.exitDate}</Mono>
              <span style={{ fontSize: 12.5, color: colors.muted }}>{exitLabel[t.exitReason] || t.exitReason}</span>
              <StatusPill $ok={t.outcome === 'win'}>{t.outcome}</StatusPill>
              <PL $value={t.pl}>${Math.abs(t.pl).toFixed(2)}</PL>
            </Row>
          ))
        ) : (
          <p style={{ padding: '20px 18px', color: colors.faint, fontFamily: font.mono, fontSize: 13 }}>
            No closed trades yet.
          </p>
        )}
      </Panel>
    </Page>
  );
}
