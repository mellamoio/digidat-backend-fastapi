import styled from "styled-components";

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

export const ModalContent = styled.div`
  background: white;
  padding: 40px;
  text-align: center;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  z-index: 10000;
  position: relative;
  max-width: 90%;
  width: 100%;
  max-width: 500px;
`;

export const ModalIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #F8BB86;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;

  span {
    font-size: 30px;
    color: #F8BB86;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

export const CancelButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 14px;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  background-color: #dd6b55;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 2px;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
`;
