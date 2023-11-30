"use client"
import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeFilled,
  SketchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuButtonKey } from '@/features/adminSlice';

const { Header, Sider, Content } = Layout;

const App: React.FC = ({ children }: any) => {

  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  const handleMenuClick = (e: any) => {
    dispatch(setMenuButtonKey(e.key));
  };

  const menuButtonKey = useSelector((state: any) => state.admin.menuButtonKey);

  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(max-width: 600px)').matches) {
        // Acciones cuando el ancho de la ventana sea menor o igual a 600px
        setCollapsed(true);
      } else {
        // Acciones cuando el ancho de la ventana sea mayor a 600px
        setCollapsed(false);
      }
    };

    // Llamada inicial al cargar la página
    handleResize();

    // Agregar el listener para cambios de tamaño en la ventana
    window.addEventListener('resize', handleResize);

    // Remover el listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menu = [
    {
      key: 'Inicio',
      icon: <HomeFilled />,
      label: 'Inicio',
    },
    {
      key: 'Rifas',
      icon: <SketchOutlined />,
      label: 'Rifas',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[menuButtonKey]}
          onClick={handleMenuClick}
          items={menu}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: (collapsed ? "none" : "unset"),
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 580,
            background: colorBgContainer,
          }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;