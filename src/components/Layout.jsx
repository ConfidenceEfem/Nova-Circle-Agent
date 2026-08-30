import styled from 'styled-components';
import { colors, font, radius, shadow } from '../theme';

export const Page = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 36px 28px 90px;

  @media (max-width: 860px) {
    padding: 24px 16px 70px;
  }
`;

export const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

export const Title = styled.h1`
  font-size: 30px;
  color: ${colors.paper};
`;

export const Sub = styled.p`
  color: ${colors.muted};
  font-size: 13.5px;
  margin-top: 8px;
`;

export const Section = styled.section`
  margin-top: ${(p) => p.$mt || '40px'};
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  color: ${colors.paper};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols || 3}, 1fr);
  gap: ${(p) => p.$gap || '18px'};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  background: ${colors.panel};
  border: 1px solid ${colors.stroke};
  border-radius: ${radius.lg};
  padding: 22px;
  box-shadow: ${shadow.card};
`;

export const StatCard = styled(Panel)`
  padding: 18px 20px;
`;

export const StatLabel = styled.div`
  font-size: 10.5px;
  color: ${colors.faint};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const StatValue = styled.div`
  font-family: ${font.mono};
  font-size: 24px;
  color: ${colors.paper};
  margin-top: 8px;
`;

export const StatSub = styled.div`
  font-family: ${font.mono};
  font-size: 12px;
  margin-top: 6px;
`;
