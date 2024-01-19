"use client";
import React from 'react';
import { Button, Col, Flex, Form, Row } from 'antd';
import FormRifa from '@/components/FormRifa';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { setListaDeRifas, setOpenFormRifa } from '@/features/adminSlice';
import CardRifa from '@/components/CardRifa';
import { useListarRifasQuery } from '@/services/userApi';
import FormBoleto from '@/components/FormBoleto';

const Rifas: React.FC = () => {

  const dispatch = useDispatch();
  const { listaDeRifas, isRifa, rifaDetalles } = useSelector((state: any) => state.admin);
  const [formRifa] = Form.useForm();

  const { data, error, isLoading, refetch } = useListarRifasQuery({});

  React.useEffect(() => {
    if (data) dispatch(setListaDeRifas(data));
  }, [data]);

  React.useEffect(() => {
    if (isRifa) refetch();
  }, [isRifa]);


  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>
          <canvas id='canvasBoleto' width={341} height={213} style={{ display: "none" }}></canvas>
        </Col>
        <Col className="gutter-row" xs={24} sm={16} md={16} lg={8}>
          <Flex vertical gap="small" style={{ width: '100%', marginBottom: '12px' }}>
            <Button type="primary" onClick={() => {
              dispatch(setOpenFormRifa(true));
              formRifa.resetFields();
            }} icon={<PlusOutlined />}>
              Registrar rifa
            </Button>
          </Flex>
          <FormRifa formRifa={formRifa} />
          {rifaDetalles && <FormBoleto />}
        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        {listaDeRifas.map((rifa: any) => (
          <Col key={rifa._id} className="gutter-row" xs={12} sm={12} md={8} lg={6}>
            <CardRifa rifa={rifa} formRifa={formRifa} />
          </Col>
        ))}
      </Row>
    </React.Suspense >
  )
}

export default Rifas;