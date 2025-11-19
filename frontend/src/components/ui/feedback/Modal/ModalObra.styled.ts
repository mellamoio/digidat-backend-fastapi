import styled from "styled-components";

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

export const ModalContainer = styled.div`
    position: relative;
    background: white;
    padding: 50px 15px 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    max-height: 90vh;
    font-family: 'Montserrat', sans-serif;
    z-index: 10000;
`;

export const HeaderModal = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: #f0f0f0;
    padding: 12px 20px;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    z-index: 1;
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
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Montserrat', sans-serif;
`;

export const Required = styled.span`
    color: red;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e8e8e8;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 870px;
    max-height: calc(90vh - 120px);
`;

export const Sidebar = styled.div`
    width: 25%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const CheckboxGroup = styled.div<{ $hasError?: boolean }>`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;
    border: 1px solid ${props => props.$hasError ? '#ff4d4f' : '#d9d9d9'};
    border-radius: 4px;
    padding: 10px;
    font-family: 'Montserrat', sans-serif;
    min-height: 200px;
    transition: border-color 0.3s;

    /* Scrollbar personalizado */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    label {
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-bottom: 8px;
        padding: 4px;
        cursor: pointer;
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        border-radius: 4px;
        transition: background 0.2s;

        &:hover {
            background: #f5f5f5;
        }
    }

    input[type="checkbox"] {
        margin-right: 8px;
        accent-color: #722AE9;
        cursor: pointer;
    }

    p {
        font-size: 13px;
        color: #999;
        margin: 0;
        font-family: 'Montserrat', sans-serif;
    }
`;

export const FormSection = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    /* Scrollbar personalizado */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;

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
    font-family: 'Montserrat', sans-serif;

    .ant-form-item {
        margin-bottom: 0;
    }

    .ant-form-item-label > label {
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 600;
        font-size: 14px;
        color: #333;
    }

    .ant-input,
    .ant-select-selector,
    .ant-picker {
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        height: 32px;
        font-family: 'Montserrat', sans-serif !important;
        
        &:hover {
            border-color: #722AE9;
        }
        
        &:focus,
        &.ant-input-focused,
        &.ant-picker-focused {
            border-color: #722AE9;
            box-shadow: 0 0 0 2px rgba(114, 42, 233, 0.1);
        }
    }

    .ant-select-focused .ant-select-selector {
        border-color: #722AE9 !important;
        box-shadow: 0 0 0 2px rgba(114, 42, 233, 0.1) !important;
    }

    .ant-picker {
        width: 100%;
    }

    .ant-select-selection-placeholder,
    .ant-select-selection-item,
    .ant-input::placeholder {
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 400;
    }

    /* Quitar asteriscos rojos de Ant Design */
    .ant-form-item-required::before {
        display: none !important;
    }

    .ant-form-item-required::after {
        display: none !important;
    }
`;