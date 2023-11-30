"use client";
import React from 'react';
import { Button, Col, Flex, Row } from 'antd';
import FormRifa from '@/components/FormRifa';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { setOpenFormRifa } from '@/features/adminSlice';
import CardRifa from '@/components/CardRifa';

const App: React.FC = () => {
  const { menuButtonKey, openFormRifa } = useSelector((state: any) => state.admin);
  const dispatch = useDispatch();
  const style: React.CSSProperties = { padding: '8px 0' };
  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>

        </Col>
        <Col className="gutter-row" xs={24} sm={16} md={16} lg={8}>
          <Flex vertical gap="small" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => dispatch(setOpenFormRifa(true))} icon={<PlusOutlined />}>
              Registrar rifa
            </Button>
          </Flex>
          <FormRifa />
        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>

        </Col>
      </Row>
      <Row gutter={16}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
          <Col className="gutter-row" xs={12} sm={12} md={8} lg={6}>
            <CardRifa />
          </Col>
        ))}

      </Row>

    </React.Suspense>
  )
}

export default App;