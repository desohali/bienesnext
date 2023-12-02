"use client";
import JuegoSecundario from '@/components/JuegoSecundario';
import { setRifaDetalles } from '@/features/adminSlice';
import { useBuscarBoletoMutation } from '@/services/userApi';
import { Button, Col, Flex, Row } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';




const App: React.FC<{ params: any }> = ({ params }: any) => {

  const dispatch = useDispatch();
  const { rifaDetalles } = useSelector((state: any) => state.admin);
  /* const [image, setimage] = React.useState<any>("../../../juegoMenor.jpeg"); */

  const [buscarRifa, { data, error, isLoading }] = useBuscarBoletoMutation();

  React.useEffect(() => {
    buscarRifa({ _id: params._idBoleto })
      .then((rifa: any) => {
        dispatch(setRifaDetalles(rifa.data))
      });
  }, []);

  React.useEffect(() => {
    const img = new Image();
    img.src = "../../../juegoMenor.jpeg";
    img.onload = () => {};
  }, []);


  const audioRef = React.useRef<any>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={6} lg={8}>

        </Col>
        <Col className="gutter-row" xs={24} sm={16} md={12} lg={8}>
          <img src="../../../juegoMenor.jpeg" style={{ width: "100%" }} />
          <audio ref={audioRef} src="../../../sigueParticipando.mp3" />
          <Flex vertical gap="small" style={{ width: '100%', marginBottom: '12px' }}>
            <Button type="primary" onClick={() => {
              if (isPlaying) {
                audioRef.current.pause();
              } else {
                audioRef.current.play();
              }
              setIsPlaying(!isPlaying);
            }} icon={<PlusOutlined />}>
              Raspa aqui
            </Button>
          </Flex>
        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={6} lg={8}>

        </Col>
      </Row>
    </React.Suspense>
  )
}

export default App;