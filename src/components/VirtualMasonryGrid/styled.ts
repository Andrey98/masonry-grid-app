import styled from 'styled-components';

type ColumnPropsType = {
  gap: number;
};

export const StyledColumns = styled.div<ColumnPropsType>`
  display: flex;
  gap: ${props => `${props.gap}px`};
`;

export const StyledColumn = styled.div<ColumnPropsType>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => `${props.gap}px`};
`;
