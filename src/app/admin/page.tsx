"use client";

import React from 'react';
import { Button, Spin, Form, Input, Select, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setloading] = React.useState(true);
  React.useEffect(() => {
    setloading(false);
  }, [])

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    )
  }

  return (
    <div>
      <Title level={2}>Formulario con 11 Campos</Title>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          field1: '',
          field2: '',
          // ... inicializa los otros campos aquí
          field11: '',
        }}
      >
        <Form.Item name="field1" label="Note" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="field2" label="Note" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="field11" label="Note" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;