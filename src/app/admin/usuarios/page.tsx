"use client";
import React from 'react';
import { Avatar, Button, Col, Flex, Form, List, Row, Tooltip, Typography } from 'antd';
import FormRifa from '@/components/FormRifa';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { setOpenFormUsuario, setListaDeUsuarios } from '@/features/userSlice';
import CardRifa from '@/components/CardRifa';
import { useListarUsuariosQuery } from '@/services/userApi';
import FormBoleto from '@/components/FormBoleto';
import FormUsuario from '@/components/FormUsuario';
const { Text } = Typography;

const Usuarios: React.FC = () => {

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
            <List
              itemLayout="horizontal"
              dataSource={[usuario]}
              renderItem={(item: any) => (
                <List.Item actions={[<Tooltip title="Editar">
                  <Button onClick={() => {
                    dispatch(setOpenFormUsuario(true));
                    formUsuario.resetFields();
                    formUsuario.setFieldsValue({ ...usuario, rifaAsignada: usuario?.rifaAsignada?._id || "" });
                  }} type="primary" shape="circle" icon={<EditOutlined />} />
                </Tooltip>]} style={style}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item?.usuario}
                    description={<>
                      <Text>{["v"].includes(item?.tipoUsuario) ? "Vendedor" : "Administrador"}</Text>
                      <br />
                      <Text>Rifa : {item?.rifaAsignada?.nombre}</Text>
                    </>
                    }
                  />
                </List.Item>
              )}
            />

          </Col>
        ))}
      </Row>

    </React.Suspense >
  )
}

export default Usuarios;