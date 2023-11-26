"use client";
import React from 'react';
import { Form, Input, Button, Row, Col, Card, Tag, Typography, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

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

const dnis = [
  '74026816', '48115295', '42142607', '77491421', '61611530', '46984573', '73422124',
  '43917257', '60507843', '71033109', '76723091', '71248260', '61702269', '71272141',
  '77014764', '75259917', '71391049', '73088000', '12345678', '74060603', '75624129',
  '72708818', '73456805', '71790187', '71067923', '76400492', '74931655', '71600418',
  '71820114', '75524592', '61025653', '26703070', '74026816', '48115295', '42142607',
  '73422124', '71033109', '76723091', '71248260', '61702269', '71272141', '71391049',
  '73088000', '26706371', '74060603', '72708818', '73456805', '71790187', '71067923',
  '76400492', '71600418', '59384120', '76937817', '40028772', '75524592', '77014664',
  '42703180', '71062503', '72546177', '73662634', '75514017', '26703070', '72408548',
  '74224991', '74917084', '72255382', '61025653', '74969966', '43558264', '46966682',
  '73422125', '45715771', '75022980', '70495793', '12345679', '97654321', '70975734'
];

const Login = () => {

  const router = useRouter();

  const [loading, setloading] = React.useState(true);
  React.useEffect(() => {
    setloading(false);
    if (localStorage.getItem("inventariador")) router.push('/registro');
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  }

  const onFinish = (values: any) => {
    console.log('values', values)
    if (dnis.includes((values.dni.trim()))) {
      localStorage.setItem("inventariador", values.dni);
      router.push('/registro');
    } else {
      swal("", "Usuario no autorizado!", "error");
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh", width: "100vw" }}>
      <Col xs={20} sm={18} md={14} lg={12}>
        <Card hoverable style={{ width: "100%" }} title={<Text strong>Registro de bienes </Text>} >
          <Form {...layout} name="login-form" initialValues={{ remember: true }} onFinish={onFinish} requiredMark={customizeRequiredMark}>
            <Form.Item label={<Text>Ingrese dni</Text>} name="dni" rules={[{ required: true, message: 'Por favor ingrese dni!' }]}>
              <Input />
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

export default Login;
