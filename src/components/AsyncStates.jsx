import styled from 'styled-components';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { colors, font, radius } from '../theme';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 20px;
  text-align: center;
`;

const Spin = styled(Loader2)`
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Text = styled.p`
  font-family: ${font.mono};
  font-size: 12.5px;
  color: ${colors.faint};
`;

const ErrorText = styled.p`
  font-size: 13.5px;
  color: ${colors.down};
  max-width: 46ch;
`;

const RetryBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${font.mono};
  font-size: 12px;
  color: ${colors.novaBright};
  border: 1px solid ${colors.stroke};
  border-radius: ${radius.pill};
  padding: 8px 14px;
  &:hover { border-color: ${colors.novaBright}; }
`;

export function LoadingState({ label = 'Loading…' }) {
  return (
    <Wrap>
      <Spin size={22} color={colors.novaBright} />
      <Text>{label}</Text>
    </Wrap>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <Wrap>
      <AlertTriangle size={22} color={colors.down} />
      <ErrorText>
        Couldn't reach the backend — {error || 'unknown error'}.<br />
        Make sure the Nova Circle backend is running and reachable at the API URL in your <code>.env</code>.
      </ErrorText>
      {onRetry && <RetryBtn onClick={onRetry}><RefreshCw size={12} /> Retry</RetryBtn>}
    </Wrap>
  );
}
