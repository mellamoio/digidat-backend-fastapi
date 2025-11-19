import styled from "styled-components";

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const ModalContainer = styled.div`
    position: relative;
    background: white;
    width: 600px;
    max-width: 90%;
    padding: 50px 20px 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    max-height: 90vh;
    overflow-y: auto;
`;

export const HeaderModal = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: #f0f0f0;
    padding: 12px 20px;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
`;

export const CloseButton = styled.button`
    background: transparent;
    color: #000;
    border: none;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.6;
    }
`;

export const Label = styled.label`
    font-size: 14px;
    color: #333;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
`;

export const Required = styled.span`
    color: #ff4d4f;
    font-size: 14px;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e8e8e8;
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 15px;

    .full-width {
        grid-column: 1 / span 2;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        
        .full-width {
            grid-column: 1;
        }
    }
`;

export const FormWrapper = styled.div`
    .ant-form-item {
        margin-bottom: 0;
    }

    .ant-input,
    .ant-select-selector {
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        
        &:hover {
            border-color: #722AE9;
        }
        
        &:focus {
            border-color: #722AE9;
            box-shadow: 0 0 0 2px rgba(114, 42, 233, 0.1);
        }
    }

    .ant-select-focused .ant-select-selector {
        border-color: #722AE9 !important;
        box-shadow: 0 0 0 2px rgba(114, 42, 233, 0.1) !important;
    }
`;
