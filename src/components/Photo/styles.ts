import styled from 'styled-components';

export const StyledImage = styled.img`
  width: 100%;
  border-radius: 8px;
  height: 100%;
`;

export const StyledImageWrapper = styled.div.attrs<{ $height: number }>(props => ({
  style: {
    height: `${props.$height}px`,
  },
}))``;
