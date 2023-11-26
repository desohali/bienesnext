"use client"
import React from 'react';
import { Form, Input, Button, Row, Col, Card, Tag, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

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

const Login = () => {
  const onFinish = (values: any) => {
    console.log('Received values:', values);
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
