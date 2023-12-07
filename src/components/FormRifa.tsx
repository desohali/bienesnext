"use client";
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, ColorPicker, DatePicker, Drawer, Flex, Form, Input, InputNumber, Row, Select, Space, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setIsRifa, setOpenFormRifa } from '@/features/adminSlice';
import { useRegistrarRifaMutation } from '@/services/userApi';
import swal from 'sweetalert';

const { Option } = Select;
const layout = {
  /*  labelCol: { span: 8 },
   wrapperCol: { span: 16 }, */
};
const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

const FormRifa: React.FC<{ formRifa: any }> = ({ formRifa }) => {

  const dispatch = useDispatch();

  const { openFormRifa } = useSelector((state: any) => state.admin);

  const existeIdRifa = Boolean(formRifa.getFieldValue("_id"));


  const style: React.CSSProperties = { width: '100%' };
  const [registrarRifa, { data, error, isLoading }] = useRegistrarRifaMutation();


  return (
    <>
      <Drawer
        title={`${existeIdRifa ? 'Actualizar' : 'Registar'} rifa`}
        width={500}
        onClose={() => dispatch(setOpenFormRifa(false))}
        open={openFormRifa}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}>
        <Form
          form={formRifa}
          {...layout}
          name="login-form"
          layout="vertical"
          style={{ width: "100%" }}
          requiredMark={customizeRequiredMark}
          initialValues={{
            _id: "",
            nombre: "",
            fecha: new Date().toLocaleDateString().split("/").reverse().map((value: string) => value.padStart(2, "0")).join("-"),
            ganador: undefined,
            premio: undefined,
            descripcion: "",
            color: "#008080"
          }}
          onFinish={async (values) => {
            await registrarRifa(values);
            dispatch(setIsRifa(true));
            dispatch(setOpenFormRifa(false));
            setTimeout(() => { dispatch(setIsRifa(false)) }, 10);
            formRifa.resetFields();
            swal("", `Rifa ${existeIdRifa ? 'Actualizada' : 'Registrada'}!`, "success");
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
                name="nombre"
                label="Nombre"
                rules={[{ required: true, message: 'Por favor, ingrese nombre' }]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Form.Item
                name="fecha"
                label="Fecha"
                rules={[{ required: true, message: 'Por favor, ingrese fecha' }]}
              >
                <Input type='date' placeholder="Fecha" style={style} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ganador"
                label="1N° ganador"
                rules={[
                  { required: true, message: 'Por favor, ingrese 1N° ganador' },
                  {
                    validator: (_, value) => {
                      if (value && value.toString().length == 4) return Promise.resolve();
                      return Promise.reject("1N° ganador, debe tener 4 digitos");
                    }
                  }
                ]}
              >
                <InputNumber placeholder="1N° ganador" style={style} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="premio"
                label="Premio"
                rules={[{ required: true, message: 'Por favor, ingrese premio' }]}
              >
                <InputNumber placeholder="Premio" style={style} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item name="color" label="Color del ticket">
                <Input type='color' placeholder="1N° ganador" style={style} />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  {existeIdRifa ? 'Actualizar' : 'Registar'}
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default FormRifa;