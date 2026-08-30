import styled from 'styled-components';
import { Clock } from 'lucide-react';
import { Page, PageHead, Title, Sub, Grid, Panel, StatLabel } from '../components/Layout';
import { Mono, PL, Button, Eyebrow } from '../components/Atoms';
import { LoadingState, ErrorState } from '../components/AsyncStates';
import { colors, font } from '../theme';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const Card = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TickerTag = styled.div`
  display: flex;
  flex-direction: column;
  b { font-size: 20px; color: ${colors.paper}; }
  small { font-family: ${font.mono}; font-size: 11px; color: ${colors.faint}; }
`;

const LegsBox = styled.div`
  background: ${colors.panelRaised};
  border-radius: 10px;
  padding: 10px 12px;
`;

const Leg = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${font.mono};
  font-size: 11.5px;
  padding: 4px 0;
  color: ${(p) => (p.$side === 'sell' ? colors.down : colors.up)};

  span:last-child { color: ${colors.muted}; }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const MetaItem = styled.div`
  small { display: block; font-size: 9.5px; color: ${colors.faint}; text-transform: uppercase; letter-spacing: 0.05em; }
  span { font-family: ${font.mono}; font-size: 12.5px; color: ${colors.paper}; }
`;

const ExitNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11.5px;
  color: ${colors.faint};
  line-height: 1.4;
`;

export default function Positions() {
  const { data: openPositions, loading, error, refetch } = useApi(api.getPositions, []);

  if (loading) return <Page><LoadingState label="Loading positions…" /></Page>;
  if (error) return <Page><ErrorState error={error} onRetry={refetch} /></Page>;

  const totalPL = openPositions.reduce((sum, p) => sum + (p.pl || 0), 0);

  const handleClose = async (id) => {
    try {
      await api.closePosition(id);
      refetch();
    } catch (err) {
      alert(`Couldn't close position: ${err.message}`);
    }
  };

  return (
    <Page>
      <PageHead>
        <div>
          <Title>Open positions</Title>
          <Sub>{openPositions.length} active trades · unrealized <PL $value={totalPL}>${Math.abs(totalPL).toFixed(2)}</PL></Sub>
        </div>
      </PageHead>

      {openPositions.length ? (
        <Grid $cols={2} $gap="20px">
          {openPositions.map((p) => {
            const daysToExpiry = p.expiration
              ? Math.max(0, Math.ceil((new Date(p.expiration) - new Date()) / 86400000))
              : null;
            return (
              <Card key={p.id}>
                <CardHead>
                  <TickerTag>
                    <b>${p.ticker}</b>
                    <small>{p.strategy}</small>
                  </TickerTag>
                  <PL $value={p.pl || 0} style={{ fontSize: 20 }}>
                    ${Math.abs(p.pl || 0).toFixed(2)}
                    {p.plPct != null && <span style={{ fontSize: 12 }}> ({p.plPct >= 0 ? '+' : ''}{p.plPct.toFixed(1)}%)</span>}
                  </PL>
                </CardHead>

                <LegsBox>
                  {p.legs.map((l, i) => (
                    <Leg key={i} $side={l.side}>
                      <span>{l.side.toUpperCase()} {l.type.toUpperCase()} ${l.strike}</span>
                      <span>exp {p.expiration || l.expiry || '—'}</span>
                    </Leg>
                  ))}
                </LegsBox>

                <MetaGrid>
                  <MetaItem>
                    <small>{p.entryCredit ? 'Credit' : p.entryDebit ? 'Debit' : 'Entry'}</small>
                    <span>{p.entryCredit != null || p.entryDebit != null ? `$${(p.entryCredit ?? p.entryDebit).toFixed(2)}` : '—'}</span>
                  </MetaItem>
                  <MetaItem>
                    <small>Current value</small>
                    <span>{p.currentValue != null ? `$${p.currentValue.toFixed(2)}` : '—'}</span>
                  </MetaItem>
                  <MetaItem>
                    <small>Days to expiry</small>
                    <span>{daysToExpiry != null ? `${daysToExpiry}d` : '—'}</span>
                  </MetaItem>
                  <MetaItem>
                    <small>Max risk</small>
                    <span>{p.maxRisk != null ? `$${p.maxRisk}` : '—'}</span>
                  </MetaItem>
                  <MetaItem>
                    <small>Max profit</small>
                    <span>{p.maxProfit ? `$${p.maxProfit}` : 'Uncapped'}</span>
                  </MetaItem>
                  <MetaItem>
                    <small>Opened</small>
                    <span>{p.openedAt ? new Date(p.openedAt).toLocaleDateString() : '—'}</span>
                  </MetaItem>
                </MetaGrid>

                <ExitNote>
                  <Clock size={12} style={{ marginTop: 1, flexShrink: 0 }} />
                  {p.exitRule || (p.hardExitAt ? `Hard exit by ${new Date(p.hardExitAt).toLocaleString()}` : 'No exit rule set')}
                </ExitNote>

                <Button $variant="danger" $sm style={{ width: '100%' }} onClick={() => handleClose(p.id)}>
                  Close position
                </Button>
              </Card>
            );
          })}
        </Grid>
      ) : (
        <Panel>
          <Eyebrow>No open positions</Eyebrow>
          <p style={{ marginTop: 8, fontSize: 13, color: colors.muted }}>The agent hasn't entered any trades yet this cycle.</p>
        </Panel>
      )}
    </Page>
  );
}
