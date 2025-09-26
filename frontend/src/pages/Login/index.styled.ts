import styled from 'styled-components';

export const LoginContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #9f7aea 0%, #722AE9 100%);
  margin: 0;
  padding: 20px;
  overflow: auto;
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.5);
  }
`;

export const Title = styled.h2`
  text-align: center;
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
  background: linear-gradient(90deg, #722AE9, #8c4dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const FormContainer = styled.div`
  .ant-form-item-label > label {
    color: #4a5568;
    font-weight: 500;
  }

  .ant-input,
  .ant-input-password {
    border-radius: 8px;
    padding: 10px 16px;
    border-color: #e2e8f0;
    transition: all 0.3s;

    &:hover, 
    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
  }

  .login-form-button {
    height: 44px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    background: linear-gradient(90deg, #722AE9, #8c4dff) !important;
    border: none !important;
    transition: all 0.3s;

    &:hover, 
    &:focus,
    &:active {
      background: linear-gradient(90deg, #722AE9, #8c4dff) !important;
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: none !important;
    }
  }
`;
