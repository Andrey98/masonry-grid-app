import styled from 'styled-components';

export const StyledMain = styled.main<{ padding: number }>`
  padding: ${props => `${props.padding}px`};
`;

export const StyledHeader = styled.h1`
  text-align: center;
  font-size: 50px;
  line-height: 1.1;
`;
