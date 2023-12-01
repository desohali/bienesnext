"use client";
import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeFilled,
  UserOutlined,
  SketchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Spin, Breadcrumb, Drawer, Space, DrawerProps, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuButtonKey } from '@/features/adminSlice';
import { Footer } from 'antd/es/layout/layout';

const { Title } = Typography;
const { Header, Content } = Layout;

const App: React.FC = ({ children }: any) => {

  const dispatch = useDispatch();
  const menuButtonKey = useSelector((state: any) => state.admin.menuButtonKey);

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  const handleMenuClick = (e: any) => {
    dispatch(setMenuButtonKey(e.key));
    setOpen(false);
  };


  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Drawer
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<DrawerProps['size']>();

  const showDefaultDrawer = () => {
    setSize('default');
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const menu: any = [
    /* {
      key: 'Inicio',
      icon: <HomeFilled />,
      label: 'Inicio',
    }, */
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
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[menuButtonKey]}
          items={[{ key: "Rifas", icon: <MenuFoldOutlined style={{ fontSize: "18px", marginLeft: "12px" }} /> }]}
          onClick={showDefaultDrawer}
        />
        <Space direction="vertical" style={{ margin: "auto" }}>
          <Title style={{ color: "white", marginBottom: "4px" }} level={3}>Rifa el medallón</Title>
        </Space>

      </Header>
      <Content style={{ padding: '0 12px' }}>
        <Drawer
          title={`${size} Drawer`}
          placement="left"
          size={size}
          onClose={onClose}
          open={open}>
          <Menu
            theme='light'
            defaultSelectedKeys={[menuButtonKey]}
            onClick={handleMenuClick}
            mode="inline"
            items={menu}
          />
        </Drawer>
        <Breadcrumb
          items={menu.filter((m: any) => m.key == menuButtonKey).map((m: any) => ({
            title: (
              <>
                {m.icon}
                <span>{m.label}</span>
              </>
            )
          }))}
          style={{ margin: '16px 0' }} />
        <div className="site-layout-content" style={{ background: colorBgContainer, padding: "12px" }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default App;