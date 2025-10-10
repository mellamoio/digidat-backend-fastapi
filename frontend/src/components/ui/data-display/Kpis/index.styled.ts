import styled from 'styled-components';

interface CardProps {
  minWidth?: number;
}

export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: ${({ minWidth = "auto" }) => 
    typeof minWidth === 'number' ? `${minWidth}px` : minWidth};
  height: 100%;
  text-align: center;
`;

export const LargeFontCard = styled(Card)`
  font-size: 26px;
  padding: 20px;
`;

export const HorizontalGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
