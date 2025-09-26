import styled from "styled-components";
import { Tabs } from "antd";

export const AjustesContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0 32px 0 24px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow-x: auto;
    
    @media (max-width: 768px) {
        padding: 0 16px;
    }
`;

export const StyledTabs = styled(Tabs)`
  padding: 0 16px;
  
  .ant-tabs-nav {
    margin: 0 0 24px 0;
    padding: 0 8px;
  }

  .ant-tabs-tab {
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 500;
  }
  
    font-size: 14px; 
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #2e2eda;
    }
  }

    background-color: #2e2eda;
    height: 3px;
  }

  .ant-tabs-content {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    margin: 0 24px 0 0;
    
    .ant-table-wrapper {
      border-radius: 8px;
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      
      .ant-table {
        min-width: 100%;
        table-layout: auto;
        border-radius: 8px;
        
        thead > tr > th {
          background: #f8f9fa;
          font-weight: 600;
          padding: 16px;
          color: #495057;
        }
        
        tbody > tr > td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #f8f9fa;
        }
      }
      
      .ant-pagination {
        margin: 16px 0 0 0;
        padding: 0 16px;
      }
    }
  }

  .ant-tabs-tab-btn {
    color: #868686;
    text-shadow: none !important;

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #2e2eda;
  }
`;