import { useState } from 'react';
import styled from 'styled-components';
import { Copy, Check, Server, Key, Terminal, AlertTriangle } from 'lucide-react';
import { Page, PageHead, Title, Sub, Grid, Panel, SectionHead, SectionTitle, Section, StatLabel } from '../components/Layout';
import { Mono, StatusPill, Eyebrow } from '../components/Atoms';
import { LoadingState, ErrorState } from '../components/AsyncStates';
import { colors, font } from '../theme';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${colors.stroke};
  &:last-child { border-bottom: none; }
`;

const RowLabel = styled.span`
  font-size: 13px;
  color: ${colors.faint};
`;

const CopyBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${colors.faint};
  &:hover { color: ${colors.novaBright}; }
`;

const InfraCard = styled(Panel)`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

const InfraIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(139,92,246,0.12);
  color: ${colors.novaBright};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ReminderBox = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(245,184,65,0.08);
  border: 1px solid rgba(245,184,65,0.3);
  color: ${colors.gold};
  font-size: 12.5px;
  line-height: 1.5;
  margin-top: 4px;
`;

export default function Account() {
  const { data: account, loading, error, refetch } = useApi(api.getAccount, []);
  const [copied, setCopied] = useState(false);

  if (loading) return <Page><LoadingState label="Connecting to Alpaca…" /></Page>;
  if (error) return <Page><ErrorState error={error} onRetry={refetch} /></Page>;

  const copyId = () => {
    navigator.clipboard?.writeText(account.accountId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const isDemo = account.accountId?.includes('DEMO');
  const balanceCorrect = account.startingBalance === 100000;

  return (
    <Page>
      <PageHead>
        <div>
          <Title>Account &amp; infrastructure</Title>
          <Sub>Connection details required for hackathon judging</Sub>
        </div>
        <StatusPill $ok={account.status === 'connected'}>
          {account.status === 'connected' ? 'Connected' : 'Disconnected'}
        </StatusPill>
      </PageHead>

      {isDemo && (
        <ReminderBox>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          This is showing demo data — add ALPACA_API_KEY / ALPACA_SECRET_KEY to the backend's .env to see your real account here.
        </ReminderBox>
      )}

      <Grid $cols={2} $gap="24px" style={{ alignItems: 'start', marginTop: 20 }}>
        <Panel>
          <SectionHead><SectionTitle>Alpaca paper account</SectionTitle></SectionHead>
          <Row>
            <RowLabel>Account ID</RowLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mono style={{ color: colors.paper, fontSize: 13 }}>{account.accountId}</Mono>
              <CopyBtn onClick={copyId}>{copied ? <Check size={13} color={colors.up} /> : <Copy size={13} />}</CopyBtn>
            </div>
          </Row>
          <Row><RowLabel>Environment</RowLabel><Mono style={{ color: colors.paper, fontSize: 13 }}>{account.environment}</Mono></Row>
          <Row><RowLabel>Starting balance</RowLabel><Mono style={{ color: colors.paper, fontSize: 13 }}>${account.startingBalance.toLocaleString()}.00</Mono></Row>
          <Row><RowLabel>Current equity</RowLabel><Mono style={{ color: colors.paper, fontSize: 13 }}>${account.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Mono></Row>
          <Row><RowLabel>Buying power</RowLabel><Mono style={{ color: colors.paper, fontSize: 13 }}>${account.buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Mono></Row>
          <Row><RowLabel>Options trading</RowLabel><StatusPill $ok={!isDemo}>{isDemo ? 'Unverified (demo)' : 'Enabled'}</StatusPill></Row>
        </Panel>

        <Panel>
          <SectionHead><SectionTitle>Submission checklist</SectionTitle></SectionHead>
          <ChecklistItem done={!isDemo} label="Real Alpaca account connected (not demo data)" />
          <ChecklistItem done={balanceCorrect} label="Funded at exactly $100,000 starting balance" />
          <ChecklistItem done={!!account.accountId && !isDemo} label="Account ID available above for judging" />
          <ChecklistItem label="Brand-new account — confirm this wasn't reused from prototyping" />
          <ChecklistItem label="One-page write-up: AI logic, risk gates, infrastructure" />
          <ChecklistItem label="Agent left running untouched through competition window" />
        </Panel>
      </Grid>

      <Section>
        <SectionHead><SectionTitle>Infrastructure</SectionTitle></SectionHead>
        <Grid $cols={3} $gap="18px">
          <InfraCard>
            <InfraIcon><Server size={18} /></InfraIcon>
            <div>
              <StatLabel>Trading API</StatLabel>
              <p style={{ fontSize: 13, color: colors.muted, marginTop: 6, lineHeight: 1.5 }}>Alpaca Trading API — paper environment, multi-leg options orders.</p>
            </div>
          </InfraCard>
          <InfraCard>
            <InfraIcon><Terminal size={18} /></InfraIcon>
            <div>
              <StatLabel>Access method</StatLabel>
              <p style={{ fontSize: 13, color: colors.muted, marginTop: 6, lineHeight: 1.5 }}>Alpaca MCP server (falls back to CLI) — required by the hackathon rules.</p>
            </div>
          </InfraCard>
          <InfraCard>
            <InfraIcon><Key size={18} /></InfraIcon>
            <div>
              <StatLabel>API keys</StatLabel>
              <p style={{ fontSize: 13, color: colors.muted, marginTop: 6, lineHeight: 1.5 }}>Stored server-side only — never exposed to this dashboard.</p>
            </div>
          </InfraCard>
        </Grid>
      </Section>
    </Page>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <Row>
      <RowLabel style={{ color: done ? colors.paper : colors.faint }}>{label}</RowLabel>
      <StatusPill $ok={!!done}>{done ? 'Done' : 'Pending'}</StatusPill>
    </Row>
  );
}
