"use client"
import React, { useRef } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Flex, Form, Input, InputNumber, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormBoleto, setTest } from '@/features/adminSlice';
import { useListarSegundosGanadoresMutation } from '@/services/userApi';

const onFinish = (values: any) => {
  console.log('Received values of form:', values);
};

const FormBoleto: React.FC = () => {

  const dispatch = useDispatch();

  const { openFormBoleto, rifaDetalles } = useSelector((state: any) => state.admin);
  const [listarSegundosGanadores, { data, error, isLoading }] = useListarSegundosGanadoresMutation();

  const [form] = Form.useForm();
  const refBoletos = React.useRef<any>();

  React.useEffect(() => {
    if (rifaDetalles) {
      listarSegundosGanadores(rifaDetalles).then((response: any) => {
        response.data.forEach((b: any) => {
          if (typeof refBoletos.current == "function") {
            refBoletos.current({ ...b, premio: 100 });
          }
        });
      });
    }
    form.resetFields();
    return () => {
      form.resetFields();
    }
  }, [rifaDetalles]);


  return (
    <Drawer
      title={`2N° ganadores : ${rifaDetalles?.cantidadGanadores}`}
      width={500}
      onClose={() => dispatch(setOpenFormBoleto(false))}
      open={openFormBoleto}
      style={{ width: "100%", }}
      styles={{

        body: {
          paddingBottom: 80,
        },
      }}>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{ maxWidth: 600, width: "100%", }}
        autoComplete="off"
      >
        <Form.List name="boletos" >
          {(fields, { add, remove }) => {
            refBoletos.current = add.bind(null);
            return (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  const boleto = form.getFieldValue("boletos")[name];
                  return (
                    <Space key={key} style={{ display: 'flex', justifyContent: "space-between", width: "100%", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        label={`1N° (${boleto.premioMayor})`}
                        {...restField}
                        name={[name, 'premioMayor']}
                      >
                      </Form.Item>
                      <Form.Item
                        label={`2N° (${boleto.premioMenor})`}
                        {...restField}
                        name={[name, 'premioMenor']}
                      >
                      </Form.Item>
                      <Form.Item
                        style={{ display: "none" }}
                        {...restField}
                        name={[name, '_id']}
                        rules={[{ required: true, message: 'Ingrese _id' }]}
                      >
                        <Input placeholder="_id" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'premio']}
                        rules={[{ required: true, message: 'Ingrese premio' }]}
                      >
                        <InputNumber placeholder="Premio" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  )
                })}
                <Form.Item>
                  <Button type="dashed" disabled onClick={() => add()} block icon={<PlusOutlined />}>
                    Agregar boleto
                  </Button>
                </Form.Item>
              </>
            )
          }}
        </Form.List>
        <Form.Item>
          <Flex vertical gap="small" style={{ width: '50%', margin: "auto" }}>
            <Button type="primary" htmlType="submit" block>
              Actualizar
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  )
};

export default FormBoleto;