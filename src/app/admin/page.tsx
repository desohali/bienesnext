"use client";
import React, { useRef } from 'react';
import { Button, Col, Flex, Form, QRCode, Row } from 'antd';
import FormRifa from '@/components/FormRifa';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { setListaDeRifas, setOpenFormRifa } from '@/features/adminSlice';
import CardRifa from '@/components/CardRifa';
import { useListarRifasQuery } from '@/services/userApi';
import FormBoleto from '@/components/FormBoleto';
const QRCodeR = require('qrcode')


var canvas: any, imagen: any, ctx: any;
const App: React.FC = () => {

  const dispatch = useDispatch();
  const { listaDeRifas, isRifa } = useSelector((state: any) => state.admin);
  const [formRifa] = Form.useForm();


  const { data, error, isLoading, refetch } = useListarRifasQuery({});

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
  // trabajo con el canva spara ver erendimiento 

  /* const refQR = React.useRef<any>();

  React.useEffect(() => {
    canvas = refCanvas.current;
    ctx = canvas.getContext("2d");
    // Carga la imagen
    imagen = new Image();
    imagen.onload = function () {
      // Dibuja la imagen en el canvas
      ctx.drawImage(imagen, 0, 0);
    };
    imagen.src = '../../ticket_mini_transparente.png';
  }, []);

  const [text, setText] = React.useState(`https://bienesnext.vercel.app/juego/1000`)
  const refCanvas = React.useRef<any>();
  const test = () => {
    // Dibujamos el color de fondo
    ctx.fillStyle = "teal";
    ctx.fillRect(0, 0, 341, 213);

    ctx.font = "bold 130px serif";
    ctx.lineWidth = 5;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.drawImage(imagen, 0, 0);
  }

  const downloadQRCode = (_id: string) => {
    const canvas: any = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
    const base64 = canvas.toDataURL("image/png");
    console.log('_id', _id)
    setText(_id);
    return base64;
  };

  const generarQR = async () => {
    const imageBase64 = await QRCodeR.toDataURL(`https://bienesnext.vercel.app/juego/${Math.floor(Math.random() * 5000)}`, {
      width: 100,
      errorCorrectionLevel: 'L',
      type: 'png',
      rendererOpts: {
        quality: 1,
      }
    });
    return imageBase64;
  } */


  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>
          {/* <canvas width={341} height={213} ref={refCanvas}></canvas> */}
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
          <FormBoleto />
        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={4} lg={8}>
          {/* <div id='myqrcode'>
            <QRCode value={refQR.current || '-'} />
          </div>
          <button onClick={async () => {
            console.time("QR");
            const tt = []
            for (let index = 0; index < 5000; index++) {
              const res = await generarQR()
              tt.push(res)

            }
            console.timeEnd("QR")
            console.log('tt', tt)

          }}>test 5000</button> */}
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

export default App;