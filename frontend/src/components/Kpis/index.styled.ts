import styled from 'styled-components';

interface CardProps {
  minWidth?: number;
}

export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: ${({ minWidth = "auto" }) => (typeof minWidth === 'number' ? `${minWidth}px` : minWidth)};
  height: 100%;
  background-color: white;
  padding: 8px;
  border-radius: 10px;
  font-size: 16px;
`;

export const LargeFontCard = styled(Card)`
  font-size: 20px;
  
  & h3, & [class*="Title"], & [data-testid="item-quantity-title"] {
    font-size: 24px !important;
    line-height: 28px;
  }
  
  & span, & [class*="Total"], & [data-testid="item-quantity-total"] {
    font-size: 36px !important;
    line-height: 40px;
  }
`;