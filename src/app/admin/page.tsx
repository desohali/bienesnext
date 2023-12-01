"use client";
import React from 'react';
import { Button, Col, Flex, Row } from 'antd';
import FormRifa from '@/components/FormRifa';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { setIsRifa, setListaDeRifas, setOpenFormRifa } from '@/features/adminSlice';
import CardRifa from '@/components/CardRifa';
import { useListarRifaQuery } from '@/services/userApi';


const App: React.FC = () => {

  const dispatch = useDispatch();
  const { listaDeRifas, isRifa } = useSelector((state: any) => state.admin);

  const { data, error, isLoading, refetch } = useListarRifaQuery({});
  React.useEffect(() => {
    if (data) {
      dispatch(setListaDeRifas(data));
    }
  }, [data]);

  React.useEffect(() => {
    if (isRifa) {
      refetch();
    }
  }, [isRifa]);



  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>

        </Col>
        <Col className="gutter-row" xs={24} sm={16} md={16} lg={8}>
          <Flex vertical gap="small" style={{ width: '100%', marginBottom: '12px' }}>
            <Button type="primary" onClick={() => dispatch(setOpenFormRifa(true))} icon={<PlusOutlined />}>
              Registrar rifa
            </Button>
          </Flex>
          <FormRifa />
        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>

        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        {listaDeRifas.map((rifa: any) => (
          <Col className="gutter-row" xs={12} sm={12} md={8} lg={6}>
            <CardRifa rifa={rifa} />
          </Col>
        ))}

      </Row>

    </React.Suspense>
  )
}

export default App;