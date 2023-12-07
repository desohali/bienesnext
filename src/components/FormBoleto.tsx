"use client"
import React, { useRef } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Drawer, Flex, Form, Input, InputNumber, List, Select, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setListaDeBoletos, setOpenFormBoleto } from '@/features/adminSlice';
import { useListarBoletosMutation, useListarSegundosGanadoresMutation, useRegistrarPremioBoletosMutation } from '@/services/userApi';
import swal from 'sweetalert';


const FormBoleto: React.FC = () => {

  const dispatch = useDispatch();

  const [value, setValue] = React.useState('');

  const { openFormBoleto, rifaDetalles, listaDeBoletos } = useSelector((state: any) => state.admin);
  const [listarBoletos, {
    data: dataMu,
    error: errorMU,
    isLoading: isLoadingMu
  }] = useListarBoletosMutation();
  const [registrarPremioBoletos, { isLoading: isLoadingRegistrar }] = useRegistrarPremioBoletosMutation();

  const boletosConPremio = listaDeBoletos
    .filter((b: any) => Boolean(b.premio));

  const boletosSinPremio = listaDeBoletos
    .map((b: any) => ({ value: b.premioMenor }));


  const [form] = Form.useForm();
  const refBoletos = React.useRef<any>();


  const onFinish = (values: any) => {

    registrarPremioBoletos({ boletos: JSON.stringify(values.boletos) }).then(async () => {
      swal("", "Los boletos se actualizaron correctamente!", "success");
      form.resetFields();
      const { data = [] }: any = await listarBoletos({ _idRifa: rifaDetalles._id });
      dispatch(setListaDeBoletos(data));
    })
  };


  return (
    <Drawer
      title="2N° ganadores"
      width={500}
      onClose={() => dispatch(setOpenFormBoleto(false))}
      open={openFormBoleto}
      style={{ width: "100%", }}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}>

      <AutoComplete
        allowClear
        bordered
        value={value}
        style={{ width: "100%", marginBottom: "12px" }}
        options={boletosSinPremio}
        onSearch={(search) => {
          setValue(search);
        }}
        onSelect={(data) => {
          const findBoleto = listaDeBoletos.find((b: any) => (b.premioMenor == data));
          if (findBoleto) {
            refBoletos.current({ ...findBoleto, premio: "" });
            setValue("");
          }
        }}
        placeholder="Buscar 2N° ganadores"
        filterOption={(inputValue, option: any) => {
          return option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }}
      />

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
                        style={{ minWidth: "120px" }}
                        rules={[{ required: true, message: 'Ingrese premio' }]}
                      >
                        <Select defaultValue="5000">
                          <Select.Option value="5000">5 mil</Select.Option>
                          <Select.Option value="10000">10 mil</Select.Option>
                          <Select.Option value="20000">20 mil</Select.Option>
                          <Select.Option value="30000">30 mil</Select.Option>
                          <Select.Option value="50000">50 mil</Select.Option>
                          <Select.Option value="80000">80 mil</Select.Option>
                          <Select.Option value="160000">160 mil</Select.Option>
                          <Select.Option value="320000">320 mil</Select.Option>
                          <Select.Option value="600000">600 mil</Select.Option>
                          <Select.Option value="1200000">1.2 millones</Select.Option>
                        </Select>
                        {/* <InputNumber placeholder="Premio" /> */}
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  )
                })}
                {/* <Form.Item>
                  <Button type="dashed" disabled onClick={() => add()} block icon={<PlusOutlined />}>
                    Agregar boleto
                  </Button>
                </Form.Item> */}
              </>
            )
          }}
        </Form.List>
        <Form.Item>
          <Flex vertical gap="small" style={{ width: '50%', margin: "auto" }}>
            <Button loading={isLoadingRegistrar} type="primary" htmlType="submit" block>
              Actualizar
            </Button>
          </Flex>
        </Form.Item>
      </Form>

      <List
        size="small"
        header={<div>{`Lista de 2N° ganadores ${boletosConPremio.length}`}</div>}
        bordered
        dataSource={boletosConPremio}
        renderItem={(item: any) => <List.Item>{`Boleto : ${item.premioMenor} Premio: ${item.premio.toFixed(2)}`}</List.Item>}
      />
    </Drawer>
  )
};

export default FormBoleto;