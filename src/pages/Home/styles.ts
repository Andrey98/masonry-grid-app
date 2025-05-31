import styled from 'styled-components';

export const StyledMain = styled.main<{ $padding: number }>`
  padding: ${props => `${props.$padding}px`};
`;

export const StyledHeader = styled.h1`
  text-align: center;
  font-size: 50px;
  line-height: 1.1;
  margin-bottom: 10px;
`;

export const StyledInput = styled.input`
  padding: 10px 12px;
  margin: 10px 0px;
  font-size: 16px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  color: #e0e0e0;
  background-color: #2c2c2c;
  border: 1px solid #555;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100%;
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: #888;
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.35);
  }
`;
