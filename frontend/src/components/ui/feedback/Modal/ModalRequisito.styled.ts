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
`;

export const HeaderModal = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: #f0f0f0;
    padding: 8px 20px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const CloseButton = styled.button`
    background: #722AE9;
    color: white;
    border: none;
    font-size: 10px;
    cursor: pointer;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    position: relative;
    top: 1px;
`;


export const Label = styled.label`
    font-size: 14px;
    color: #333;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
`;

export const Required = styled.span`
    color: red;
`;

export const Select = styled.select`
    width: 100%;
    height: 36px;
    padding: 5px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 15px;
`;

export const Button = styled.button`
    padding: 8px 14px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &.btn-primary {
        background-color: #722AE9;
        color: white;
    }

    &.btn-secondary {
        background-color: #ccc;
        color: black;
    }
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 15px;

    .full-width {
        grid-column: 1 / span 2;
    }

    .responsables {
        grid-column: 2 / 3;
        grid-row: 3;
    }

    .categorias {
        grid-column: 1 / 2;
        grid-row: 3;
    }
`;

export const EditorWrapper = styled.div`
  .ql-editor {
    max-height: 200px;
    overflow-y: auto;
  }

  .ql-toolbar {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .ql-container {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

export const FormWrapper = styled.div`
  .ant-form-item {
    margin-bottom: 0; /* Anulamos el margin-bottom de Ant Design */
  }
`;