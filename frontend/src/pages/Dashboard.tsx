import React from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, Badge, Typography, Card, Row, Col, Statistic, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  ArrowUpOutlined,
  // ArrowDownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Perfil
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />}
        onClick={() => {
          localStorage.removeItem('access_token');
          navigate('/login');
        }}
      >
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={250}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px 0 rgba(0, 0, 0, 0.1)',
          zIndex: 1,
        }}
      >
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>DigiDat</Title>
          <Text type="secondary">Panel de Control</Text>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          style={{ borderRight: 0 }}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            {
              key: 'projects',
              icon: <ProjectOutlined />,
              label: 'Proyectos',
            },
            {
              key: 'users',
              icon: <TeamOutlined />,
              label: 'Usuarios',
            },
            {
              key: 'documents',
              icon: <FileTextOutlined />,
              label: 'Documentos',
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: 'Configuración',
            },
          ]}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)',
          zIndex: 1,
        }}>
          <div style={{ flex: 1 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge count={5} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: '18px' }} />}
                style={{ color: 'rgba(0, 0, 0, 0.65)' }}
              />
            </Badge>
            
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>Usuario</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ 
            padding: 24, 
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: '100%',
          }}>
            <Title level={3}>Resumen General</Title>
            
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Proyectos Activos"
                    value={12}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Tareas Pendientes"
                    value={8}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Documentos"
                    value={45}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Usuarios"
                    value={24}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Card title="Actividad Reciente" style={{ marginBottom: 24 }}>
              <p>No hay actividad reciente para mostrar.</p>
            </Card>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="Proyectos en Progreso">
                  <p>No hay proyectos en progreso.</p>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Tareas Pendientes">
                  <p>No hay tareas pendientes.</p>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;