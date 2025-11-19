import styled from "styled-components";

export const AjustesContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow-x: auto;
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    width: calc(100% - 56px);
    min-height: 0;
    margin: 20px auto 0;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: width 0.3s ease, padding 0.3s ease, margin 0.3s ease;
    max-width: min(95vw, 1920px);
    min-width: 300px;
    overflow-x: hidden;
    overflow-y: visible;
    
    @media (max-width: 768px) {
        width: calc(100% - 32px);
        padding: 16px;
    }

    /* Estilos para las pestañas */
    .ant-tabs-tab {
        &:hover {
            color: #722AE9 !important;
        }
    }

    .ant-tabs-tab.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
            color: #722AE9 !important;
        }
    }

    .ant-tabs-ink-bar {
        background: #722AE9 !important;
    }
`;