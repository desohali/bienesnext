"use client";
import React from 'react';
import { Form, Input, Button, Row, Col, Card, Tag, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
const { Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

const App = () => {
  const router = useRouter();

  const onFinish = (values: any) => {
    localStorage.setItem("usuario", JSON.stringify(values));
    router.push('/registro');
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh", width: "100vw" }}>
      <Col xs={20} sm={18} md={14} lg={12}>
        <Card hoverable style={{ width: "100%" }} title={<Text strong>Autenticación</Text>} >
          <Form {...layout} name="login-form" initialValues={{ remember: true }} onFinish={onFinish} requiredMark={customizeRequiredMark}>
            <Form.Item label={<Text>Usuario</Text>} name="usuario" rules={[{ required: true, message: 'Por favor ingrese usuario!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label={<Text>Contraseña</Text>} name="clave" rules={[{ required: true, message: 'Por favor ingrese contraseña!' }]}>
              <Input type='password' />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button icon={<ArrowRightOutlined />} type="primary" htmlType="submit">
                Ingresar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default App;
