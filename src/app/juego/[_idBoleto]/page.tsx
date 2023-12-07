"use client";
import JuegoSecundario from '@/components/JuegoSecundario';
import { setRifaDetalles } from '@/features/adminSlice';
import { useActualizarBoletoMutation, useBuscarBoletoMutation } from '@/services/userApi';
import { Button, Col, Flex, Row } from 'antd';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import swal from 'sweetalert';

const THREE = require('three');

var canvas: any, ctx: any, imagen: any;
var width = 642, height = 1280;

const App: React.FC<{ params: any }> = ({ params }: any) => {


  const dispatch = useDispatch();
  const { rifaDetalles: boletoDetalles } = useSelector((state: any) => state.admin);


  const [buscarRifa, { data, error, isLoading }] = useBuscarBoletoMutation();
  const [actualizarBoleto, { data: dataBoleto }] = useActualizarBoletoMutation();

  React.useEffect(() => {
    buscarRifa({ _id: params._idBoleto })
      .then((rifa: any) => {
        dispatch(setRifaDetalles(rifa.data))
      });
  }, []);

  const videoRef = React.useRef<any>(null);
  const refCanvas2d = React.useRef<any>();
  const [videoLoaded, setVideoLoaded] = React.useState(false);


  React.useEffect(() => {
    canvas = document.querySelector("canvas");
  }, []);

  const [urlVideo, setUrlVideo] = React.useState("");
  React.useEffect(() => {

    if (boletoDetalles) {
      if (boletoDetalles.estadoMenor) {
        const videoName = boletoDetalles.premio
          ? `premio${boletoDetalles.premio.toString()}`
          : 'sigueIntentando';
        setUrlVideo(`../../../videos/${videoName}.mp4`);
        const videoElement: any = videoRef.current;

        const handleCanPlayThrough = () => {
          // Cuando el video está completamente cargado, establecer el estado como cargado
          setVideoLoaded(true);
        };

        videoElement.addEventListener('canplaythrough', handleCanPlayThrough);

        // Comenzar la carga del video
        videoElement.load();
      }
    }
  }, [boletoDetalles]);


  const [showVideoResponse, setShowVideoResponse] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  React.useEffect(() => {

    const listenerClick = async (event: any) => {
      const rect = canvas.getBoundingClientRect(); // Posición y tamaño del canvas en la ventana
      const scaleX = canvas.width / rect.width; // Factor de escala en X
      const scaleY = canvas.height / rect.height; // Factor de escala en Y

      // Obtener las coordenadas escaladas dentro del canvas
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      // Coordenadas del rectángulo 170, 788.5, 290, 127.5
      const rectX = 170;
      const rectY = 788.5;
      const rectWidth = 290;
      const rectHeight = 127.5;


      // Verificar si el click está dentro del rectángulo
      if (
        x >= rectX &&
        x <= rectX + rectWidth &&
        y >= rectY &&
        y <= rectY + rectHeight
      ) {
        setShowVideoResponse(true);
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);

        canvas.removeEventListener('click', listenerClick);
        await actualizarBoleto({ _id: boletoDetalles._id });

      }
    };

    if (boletoDetalles) {

      if (boletoDetalles.estadoMenor) {
        canvas.addEventListener("click", listenerClick);
      }
      ctx = canvas.getContext("2d");

      imagen = new Image();
      imagen.src = "../../../videos/fondoPremioMenor.jpeg";
      imagen.onload = () => {
        // Dibuja la imagen en el canvas
        ctx.drawImage(imagen, 0, 0);
        ctx.lineWidth = 2;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        if (boletoDetalles.estadoMenor) {
          ctx.font = "bold 48px serif";
          ctx.fillText(boletoDetalles?.fechaRegistro, 50, 50);
          ctx.strokeText(boletoDetalles?.fechaRegistro, 50, 50);
          // Dibujamos el texto de las fechas
          ctx.font = "bold 58px serif";

          ctx.fillText(boletoDetalles?.premioMayor, 250, ((height / 2) + 62.5));
          ctx.strokeText(boletoDetalles?.premioMayor, 250, ((height / 2) + 62.5));

          ctx.fillText(boletoDetalles?.premioMenor, 250, ((height / 2) + 127.5));
          ctx.strokeText(boletoDetalles?.premioMenor, 250, ((height / 2) + 127.5));
        } else {
          ctx.font = "bold 48px serif";
          ctx.fillText(boletoDetalles?.fechaRegistro, 50, 50);
          ctx.strokeText(boletoDetalles?.fechaRegistro, 50, 50);
          ctx.font = "bold 36px serif";
          if (boletoDetalles?.premio) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 625, 628, 300);
            ctx.fillStyle = "black";

            ctx.fillText(`Premio de ${boletoDetalles?.premio} pendiente de pago!`, 25, 775);
          } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 625, 628, 300);
            ctx.fillStyle = "white";

            ctx.fillText(`Este boleto ya fue jugado y no`, 50, 750);
            ctx.fillText(`tuvo premio.`, 50, 800);
          }

        }

      };
    }

    return () => {
      canvas.removeEventListener('click', listenerClick);
    };

  }, [boletoDetalles]);


  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={4} md={6} lg={8}>

        </Col>
        <Col className="gutter-row" xs={24} sm={16} md={12} lg={8}>

          <canvas style={{ display: showVideoResponse ? "none" : "" }} ref={refCanvas2d} width={628} height={1280} ></canvas>

          <video style={{ display: !showVideoResponse ? "none" : "" }} ref={videoRef} width="100%">
            <source src={urlVideo} type="video/mp4" />
            Tu navegador no admite la reproducción de videos.
          </video>

        </Col>
        <Col className="gutter-row" xs={24} sm={4} md={6} lg={8}>

        </Col>
      </Row>
    </React.Suspense>
  )
}

export default App;