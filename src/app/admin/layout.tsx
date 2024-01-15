"use client";
import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeFilled,
  UserOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  QrcodeOutlined,
  GiftOutlined,
  SketchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Spin, Breadcrumb, Drawer, Space, DrawerProps, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuButtonKey } from '@/features/adminSlice';
import { Footer } from 'antd/es/layout/layout';
import { useRouter } from 'next/navigation';
import { setUser } from '@/features/userSlice';

const { Title } = Typography;
const { Header, Content } = Layout;
enum OpcionesMenu {
  Rifas = 'Rifas',
  Usuarios = 'Usuarios',
  PremiosQR = 'PremiosQR',
  ValidadorQR = 'ValidadorQR',
  cerrarSesion = 'cerrarSesion'
}
const url = "https://bienesnext.vercel.app/admin";

const App: React.FC = ({ children }: any) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const menuButtonKey = useSelector((state: any) => state.admin.menuButtonKey);

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  const handleMenuClick = (e: any) => {
    // Verificar la opción seleccionada
    switch (e.key as OpcionesMenu) {
      case OpcionesMenu.Rifas:
        router.push(url + '/rifas');
        break;
      case OpcionesMenu.Usuarios:
        router.push(url + '/usuarios');
        break;
      case OpcionesMenu.PremiosQR:
        router.push(url + '/premios');
        break;
      case OpcionesMenu.ValidadorQR:
        router.push(url + '/boletos-devueltos');
        break;
      default:
        window.localStorage.removeItem("usuario");
        dispatch(setUser(null));
        router.push('https://bienesnext.vercel.app/login');
        break;
    }
    dispatch(setMenuButtonKey(e.key as OpcionesMenu));
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
    {
      key: OpcionesMenu.Rifas,
      icon: <SketchOutlined />,
      label: 'Rifas',
    },
    {
      key: OpcionesMenu.Usuarios,
      icon: <UsergroupAddOutlined />,
      label: 'Usuarios',
    },
    {
      key: OpcionesMenu.PremiosQR,
      icon: <GiftOutlined />,
      label: 'Premios QR',
    },
    {
      key: OpcionesMenu.ValidadorQR,
      icon: <QrcodeOutlined />,
      label: 'Validador QR',
    },
    {
      key: OpcionesMenu.cerrarSesion,
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
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
          title="Opciones de rifas QR"
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