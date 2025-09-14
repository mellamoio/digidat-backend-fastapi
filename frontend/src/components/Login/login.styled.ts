// src/components/Login/login.styled.ts
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
  background: #f5f5f5;
`;

export const Title = styled.h1`
  color: #333;
`;

export const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 250px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #646cff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #535bf2;
  }
`;