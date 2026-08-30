import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ShieldCheck, Save } from 'lucide-react';
import { Page, PageHead, Title, Sub, Grid, Panel, SectionHead, SectionTitle, Section } from '../components/Layout';
import { Button, Eyebrow } from '../components/Atoms';
import { LoadingState, ErrorState } from '../components/AsyncStates';
import { colors, font, radius } from '../theme';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.muted};
`;

const Hint = styled.span`
  font-size: 11.5px;
  color: ${colors.faint};
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  background: ${colors.panelRaised};
  border: 1px solid ${colors.stroke};
  border-radius: ${radius.md};
  padding: 11px 13px;
  font-size: 13.5px;
  font-family: ${font.mono};
  color: ${colors.paper};

  &:focus { border-color: ${colors.novaBright}; outline: none; }
`;

const Suffix = styled.span`
  font-family: ${font.mono};
  font-size: 12.5px;
  color: ${colors.faint};
`;

const WatchlistTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  font-family: ${font.mono};
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${colors.panelRaised};
  border: 1px solid ${colors.stroke};
  color: ${colors.paper};
`;

const SavedNote = styled.p`
  font-size: 12px;
  color: ${colors.up};
  margin-top: 14px;
`;

export default function RiskSettings() {
  const { data: riskSettings, loading, error, refetch } = useApi(api.getRiskSettings, []);
  const { data: symbols } = useApi(api.getWatchlistSymbols, []);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Sync local editable form once the backend data arrives — but only
  // once, so re-fetching after a save doesn't clobber unsaved edits.
  useEffect(() => {
    if (riskSettings && !form) setForm(riskSettings);
  }, [riskSettings, form]);

  if (loading || !form) return <Page><LoadingState label="Loading risk gates…" /></Page>;
  if (error) return <Page><ErrorState error={error} onRetry={refetch} /></Page>;

  const set = (k) => (e) => {
    setSaved(false);
    setForm((f) => ({ ...f, [k]: Number(e.target.value) }));
  };

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const updated = await api.updateRiskSettings(form);
      setForm(updated);
      setSaved(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <PageHead>
        <div>
          <Title>Risk gates</Title>
          <Sub>Hard limits the agent obeys regardless of what any signal says</Sub>
        </div>
      </PageHead>

      <Grid $cols={2} $gap="24px" style={{ alignItems: 'start' }}>
        <Panel>
          <SectionHead><SectionTitle>Position sizing</SectionTitle></SectionHead>

          <Field>
            <Label>Max risk per trade</Label>
            <InputRow>
              <Input type="number" value={form.maxRiskPerTradePct} onChange={set('maxRiskPerTradePct')} />
              <Suffix>% of account equity</Suffix>
            </InputRow>
            <Hint>Caps the max loss on any single defined-risk trade.</Hint>
          </Field>

          <Field>
            <Label>Max concurrent positions</Label>
            <Input type="number" value={form.maxConcurrentPositions} onChange={set('maxConcurrentPositions')} />
            <Hint>Agent won't open a new trade past this count.</Hint>
          </Field>

          <Field>
            <Label>Daily loss limit</Label>
            <InputRow>
              <Input type="number" value={form.dailyLossLimitPct} onChange={set('dailyLossLimitPct')} />
              <Suffix>% of equity</Suffix>
            </InputRow>
            <Hint>Circuit breaker — halts new entries for the rest of the day if hit.</Hint>
          </Field>

          <Field>
            <Label>Profit target (defined-risk trades)</Label>
            <InputRow>
              <Input type="number" value={form.profitTargetPct} onChange={set('profitTargetPct')} />
              <Suffix>% of max profit</Suffix>
            </InputRow>
          </Field>
        </Panel>

        <Panel>
          <SectionHead><SectionTitle>Signal thresholds</SectionTitle></SectionHead>

          <Field>
            <Label>Sell-premium threshold</Label>
            <InputRow>
              <Input type="number" step="0.01" value={form.sellPremiumThreshold} onChange={set('sellPremiumThreshold')} />
              <Suffix>ratio ≥</Suffix>
            </InputRow>
            <Hint>Implied move ÷ historical move above this → sell premium (iron condor).</Hint>
          </Field>

          <Field>
            <Label>Buy-premium threshold</Label>
            <InputRow>
              <Input type="number" step="0.01" value={form.buyPremiumThreshold} onChange={set('buyPremiumThreshold')} />
              <Suffix>ratio ≤</Suffix>
            </InputRow>
            <Hint>Implied move ÷ historical move below this → buy premium (long strangle).</Hint>
          </Field>

          <Field>
            <Label>Min. open interest</Label>
            <Input type="number" value={form.minOpenInterest} onChange={set('minOpenInterest')} />
            <Hint>Liquidity gate — contracts below this are skipped.</Hint>
          </Field>

          <Field>
            <Label>Max bid-ask spread</Label>
            <InputRow>
              <Input type="number" value={form.maxBidAskSpreadPct} onChange={set('maxBidAskSpreadPct')} />
              <Suffix>% of mid price</Suffix>
            </InputRow>
          </Field>
        </Panel>
      </Grid>

      <Section>
        <SectionHead><SectionTitle>Watchlist</SectionTitle></SectionHead>
        <Panel>
          <Eyebrow style={{ marginBottom: 12 }}>{symbols ? symbols.length : '—'} tickers monitored</Eyebrow>
          <WatchlistTags>
            {(symbols || []).map((s) => <Tag key={s}>${s}</Tag>)}
          </WatchlistTags>
          <Hint style={{ display: 'block', marginTop: 14 }}>Editable via PUT /api/risk/watchlist-symbols — a dedicated edit UI can be added here once you're ready.</Hint>
        </Panel>
      </Section>

      <Section>
        <Panel style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Eyebrow><ShieldCheck size={12} /> Hard exit rule</Eyebrow>
            <p style={{ marginTop: 8, fontSize: 13.5, color: colors.paper }}>{form.hardExitRule}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {saved && <SavedNote>Saved</SavedNote>}
            {saveError && <SavedNote style={{ color: colors.down }}>{saveError}</SavedNote>}
            <Button onClick={save} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Save risk gates'}
            </Button>
          </div>
        </Panel>
      </Section>
    </Page>
  );
}
