"use client";
import React from 'react';
import swal from 'sweetalert';
import Marquee from 'react-fast-marquee';
import { setRifaDetalles } from '@/features/adminSlice';
import { useBuscarBoletoMutation } from '@/services/userApi';
import { Alert, Button, Col, Flex, Row, Spin, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
const { Title } = Typography;

var canvas: any, ctx: any;
var numerosInicio = [0, 0, 0, 0];
var numerosGanadores = [2, 3, 4, 5];
var cordenadas = { x: 150, y: 525 };// y 100
var iniciarJuegoTimeout: any;
var width = 1024, height = 567;// 130
var imagen: any;

const page = ({ params }: any) => {

  const dispatch = useDispatch();
  const { rifaDetalles } = useSelector((state: any) => state.admin);

  const [buscarRifa, { data, error, isLoading }] = useBuscarBoletoMutation();
  React.useEffect(() => {
    buscarRifa({ _id: params._idBoleto })
      .then((rifa: any) => {
        dispatch(setRifaDetalles(rifa.data))
      });
  }, []);


  React.useEffect(() => {
    if (canvas) {
      cordenadas = { x: 525, y: 525 };
    } else {
      cordenadas = { x: 150, y: 525 };
    }
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    // Carga la imagen
    imagen = new Image();
    imagen.onload = function () {
      // Dibuja la imagen en el canvas
      ctx.drawImage(imagen, 0, 0);
    };
    imagen.src = '../../juegoMayor1024.png';

    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(0, 0, width, height);

    ctx.font = "bold 130px serif";
    ctx.lineWidth = 5;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";

    for (const numero of numerosInicio) {
      ctx.fillText("1 ", cordenadas.x, cordenadas.y - 95);
      ctx.strokeText("1 ", cordenadas.x, cordenadas.y - 95);

      ctx.fillText("0 ", cordenadas.x, cordenadas.y);
      ctx.strokeText("0 ", cordenadas.x, cordenadas.y);

      ctx.fillText("9 ", cordenadas.x, cordenadas.y + 95);
      ctx.strokeText("9 ", cordenadas.x, cordenadas.y + 95);

      cordenadas.x += 95;
    }

    /* return () => {
      detenerJuego();
    } */

  }, [data]);




  const iniciarJuego = React.useCallback(() => {

    cordenadas = { x: 525, y: 430 };
    ctx.clearRect(0, 0, width, height);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";
    for (const numero of numerosInicio) {

      cordenadas.y = 430;
      const randoms = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
      ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y);
      ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y);
      cordenadas.y += 95;
      ctx.fillText(randoms[1].toString(), cordenadas.x, cordenadas.y);
      ctx.strokeText(randoms[1].toString(), cordenadas.x, cordenadas.y);
      cordenadas.y += 95;
      ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y);
      ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y);
      cordenadas.x += 95;
    }

    ctx.drawImage(imagen, 0, 0);

    iniciarJuegoTimeout = setTimeout(() => {
      ctx.clearRect(0, 0, width, height);
      iniciarJuego();
    }, 50);
  }, [iniciarJuegoTimeout, rifaDetalles]);

  const detenerJuego = React.useCallback(() => {
    console.log('rifaDetalles', rifaDetalles)
    
    clearTimeout(iniciarJuegoTimeout);
    cordenadas = { x: 525, y: 525 };
    ctx.clearRect(0, 0, width, height);
    // Dibujamos el color de fondo
    ctx.fillStyle = rifaDetalles?.color || "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";
    for (const numero of (rifaDetalles?.ganador || "").split("")) {
      const randoms = [
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
      ];
      ctx.fillText(randoms[0].toString(), cordenadas.x, cordenadas.y - 95);
      ctx.strokeText(randoms[0].toString(), cordenadas.x, cordenadas.y - 95);

      ctx.fillText(numero.toString(), cordenadas.x, cordenadas.y);
      ctx.strokeText(numero.toString(), cordenadas.x, cordenadas.y);

      ctx.fillText(randoms[2].toString(), cordenadas.x, cordenadas.y + 95);
      ctx.strokeText(randoms[2].toString(), cordenadas.x, cordenadas.y + 95);

      cordenadas.x += 95;
    }
    ctx.drawImage(imagen, 0, 0);
  }, [iniciarJuegoTimeout, rifaDetalles]);


  /* if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  } */

  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
          <Alert style={{ marginBottom:"12px" }} message={
            <Marquee pauseOnHover gradient={false}>
              <Title style={{ marginBottom: "6px" }} level={3}>Rifa el medallón - premio {rifaDetalles?.premio.toFixed(2)}</Title>
            </Marquee>
          } type="info" showIcon />
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={2} lg={4}>

        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={20} lg={16}>
          <canvas width={1024} height={657} style={{ width: "100%", borderRadius: ".5rem" }}></canvas>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={2} lg={4}>
          <Flex vertical gap="small" style={{ width: '100%' }}>
            <Button danger onClick={async () => {
              const iniciar = await swal({
                title: "¿ Desea iniciar el juego ?",
                text: "",
                icon: "warning",
                buttons: { cancel: true, confirm: true },
                dangerMode: true,
              });
              if (iniciar) iniciarJuego();
            }} type="primary" block>
              Iniciar juego
            </Button>
            <Button onClick={detenerJuego} type="primary" block>
              Terminar juego
            </Button>
          </Flex>
        </Col>
      </Row>
    </React.Suspense>
  )
}

export default page;