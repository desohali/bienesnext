"use client";
import React from 'react';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { useListarRifasQuery, useRegistrarUsuarioMutation } from '@/services/userApi';
import { setIsRifa, setListaDeRifas, setOpenFormRifa } from '@/features/adminSlice';
import { Button, Col, Drawer, Flex, Form, Input, InputNumber, Row, Select, Tag } from 'antd';
import { setIsUsuario, setOpenFormUsuario } from '@/features/userSlice';

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

const FormUsuario: React.FC<{ formUsuario: any }> = ({ formUsuario }) => {

  const dispatch = useDispatch();
  const { listaDeRifas } = useSelector((state: any) => state.admin);
  const { openFormUsuario } = useSelector((state: any) => state.user);
  const [tipoUsuario, setTipoUsuario] = React.useState<string>("v");

  const existeIdUsuario = Boolean(formUsuario.getFieldValue("_id"));

  const style: React.CSSProperties = { width: '100%' };

  const [registrarUsuario, { data: dataR, error: errorR, isLoading: isLoadingR }] = useRegistrarUsuarioMutation();

  const { data, error, isLoading, refetch } = useListarRifasQuery({});

  React.useEffect(() => {
    if (data) dispatch(setListaDeRifas(data));
  }, [data]);

  return (
    <>
      <Drawer
        title={`${existeIdUsuario ? 'Actualizar' : 'Registar'} usuario`}
        width={500}
        onClose={() => dispatch(setOpenFormUsuario(false))}
        open={openFormUsuario}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}>
        <Form
          form={formUsuario}
          name="login-form"
          layout="vertical"
          style={{ width: "100%" }}
          requiredMark={customizeRequiredMark}
          initialValues={{
            _id: "",
            usuario: "",
            password: "",
            tipoUsuario: "v",
            estado: true,
            descripcion: ""
          }}
          onFinish={async (values) => {
            await registrarUsuario(values);
            dispatch(setIsUsuario(true));
            dispatch(setOpenFormUsuario(false));
            setTimeout(() => { dispatch(setIsUsuario(false)) }, 10);
            formUsuario.resetFields();
            swal("", `Usuario ${existeIdUsuario ? 'actualizado' : 'registrado'}!`, "success");
          }} >
          <Row gutter={16}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Form.Item
                name="_id"
                label="_id"
                style={{ display: "none" }}
              >
                <Input placeholder="_id" />
              </Form.Item>
              <Form.Item
                name="usuario"
                label="Usuario"
                rules={[{ required: true, message: 'Por favor, ingrese usuario' }]}
              >
                <Input placeholder="Usuario" style={style} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Form.Item
                name="password"
                label="Contraseña"
                rules={[{ required: true, message: 'Por favor, ingrese contraseña' }]}
              >
                <Input placeholder="Contraseña" style={style} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tipoUsuario"
                label="Tipo usuario"
                rules={[{ required: true, message: 'Por favor, seleccione tipo usuario' }]}
              >
                <Select defaultValue="v" onChange={(e: any) => {
                  /* setTipoUsuario(formUsuario.getFieldValue("tipoUsuario")); */
                }}>
                  <Select.Option value="v">Vendedor</Select.Option>
                  <Select.Option value="a">Administrador</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estado"
                label="Estado"
                rules={[{ required: true, message: 'Por favor, seleccione estado' }]}
              >
                <Select defaultValue={true}>
                  <Select.Option value={true}>Activo</Select.Option>
                  <Select.Option value={false}>Inactivo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="descripcion"
                label="Descripción"
              >
                <Input.TextArea rows={1} placeholder="Descripción" />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={24}>
              <Flex vertical gap="small" style={{ width: '50%', margin: "auto" }}>
                <Button loading={isLoading} type="primary" block htmlType="submit">
                  {existeIdUsuario ? 'Actualizar' : 'Registar'}
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default FormUsuario;