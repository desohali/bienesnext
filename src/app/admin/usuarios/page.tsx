"use client";
import React from 'react';
import { Avatar, Button, Card, Col, Flex, Form, Row, Tag, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, UserOutlined, EditOutlined, QrcodeOutlined } from '@ant-design/icons';
import { setOpenFormUsuario, setListaDeUsuarios } from '@/features/userSlice';
import { useListarUsuariosQuery } from '@/services/userApi';
import FormUsuario from '@/components/FormUsuario';
import { useRouter } from 'next/navigation';
const { Meta } = Card;

const enumTipoUsuario: any = {
  s: "Super Usuario",
  a: "Administrador",
  v: "Vendedor"
};

const Usuarios: React.FC = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { listaDeUsuarios, isUsuario } = useSelector((state: any) => state.user);
  const [formUsuario] = Form.useForm();

  const { data, error, isLoading, refetch } = useListarUsuariosQuery({});

  React.useEffect(() => {
    if (data) {
      dispatch(setListaDeUsuarios(data));
    }
  }, [data]);

  React.useEffect(() => {
    if (isUsuario) refetch();
  }, [isUsuario]);
  const style: React.CSSProperties = { border: "1px solid rgba(0,0,0,.1)", borderRadius: ".5rem", padding: ".5rem" };

  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>

        </Col>
        <Col className="gutter-row" xs={24} sm={16} md={16} lg={8}>
          <Flex vertical gap="small" style={{ width: '100%', marginBottom: '12px' }}>
            <Button type="primary" onClick={() => {
              dispatch(setOpenFormUsuario(true));
              formUsuario.resetFields();
            }} icon={<PlusOutlined />}>
              Registrar usuario
            </Button>
          </Flex>
          <FormUsuario formUsuario={formUsuario} />
        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>
        </Col>
      </Row>

      <Row gutter={[12, 12]}>
        {listaDeUsuarios.map((usuario: any) => (
          <Col key={usuario._id} className="gutter-row" xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ width: "100%" }}
              actions={[
                <Tooltip title="Editar">
                  <Button type="primary" onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setOpenFormUsuario(true));
                    formUsuario.resetFields();
                    formUsuario.setFieldsValue({ ...usuario, rifaAsignada: usuario?.rifaAsignada?._id || "" });
                  }} shape="circle" icon={<EditOutlined />} />
                </Tooltip>,
                <Tooltip title="Boletos Vendidos">
                  <Button type="primary" onClick={(e) => {
                    e.stopPropagation();
                    router.push(`./usuarios/${usuario?._id}`);
                  }} shape="circle" icon={<QrcodeOutlined />} />
                </Tooltip>
              ]}
            >
              <Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={usuario?.usuario}
                description={(
                  <Tag color={usuario?.estado ? "success" : "error"}>
                    {enumTipoUsuario[usuario?.tipoUsuario]}
                  </Tag>
                )}
              />
            </Card>

          </Col>
        ))}
      </Row>

    </React.Suspense >
  )
}

export default Usuarios;