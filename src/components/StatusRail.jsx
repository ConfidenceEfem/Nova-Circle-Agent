import styled from 'styled-components';
import { colors, font } from '../theme';
import { signalMeta } from './Atoms';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const Rail = styled.div`
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid ${colors.stroke};
  background: ${colors.panel};
  padding: 8px 0;
  mask-image: linear-gradient(90deg, transparent, black 4%, black 96%, transparent);
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  animation: marquee 48s linear infinite;
`;

const Item = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 22px;
  font-family: ${font.mono};
  font-size: 12px;
  white-space: nowrap;
  border-right: 1px solid ${colors.stroke};

  b { color: ${colors.paper}; font-weight: 600; }
`;

const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => signalMeta(p.$signal).color};
`;

export default function StatusRail() {
  const { data: watchlist } = useApi(api.getWatchlist, []);
  if (!watchlist || !watchlist.length) return null; // no rail while loading or if backend is unreachable

  const doubled = [...watchlist, ...watchlist];
  return (
    <Rail>
      <Track>
        {doubled.map((t, i) => (
          <Item key={i}>
            <Dot $signal={t.signal} />
            <b>${t.ticker}</b>
            <span style={{ color: colors.faint }}>ratio {t.ratio != null ? t.ratio.toFixed(2) : '—'}</span>
          </Item>
        ))}
      </Track>
    </Rail>
  );
}
