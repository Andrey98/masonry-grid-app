import styled from 'styled-components';

export const StyledErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  background-color: #fff5f5;
  color: #cc0000;
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px auto;
  max-width: 600px;
`;

export const StyledErrorTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #a50000;
`;

export const StyledErrorMessage = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

export const StyledErrorDetailsPre = styled.pre`
  background-color: #ffebeb;
  border: 1px dashed #ff9999;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
`;

export const StyledTryAgainButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #ff6666;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ff4d4d;
  }
`;
