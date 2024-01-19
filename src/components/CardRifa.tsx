"use client";
import React from 'react';
import { EyeOutlined, EditOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { setListaDeBoletos, setOpenFormBoleto, setOpenFormRifa, setRifaDetalles } from '@/features/adminSlice';
import { useDispatch } from 'react-redux';
import { useListarBoletosMutation, useListarBoletosQueryQuery } from '@/services/userApi';
const { PDFDocument, rgb } = require('pdf-lib');
const QRCode = require('qrcode');

var pdfDoc: any;
var imagen: any;
////////////////////////////////////////////////////////////////////
const imagenLoaded = (imageBase64: string) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => { resolve(img) }
    img.onerror = err => { throw err }
    img.src = imageBase64
  });
};
const crearBoleto = async (element: any, canvas: any, ctx: any, findRifa: any) => {
  const imageBase64 = await QRCode.toDataURL(`https://bienesnext.vercel.app/juego/${element._id}`, {
    width: 80,
    errorCorrectionLevel: 'L',
    type: 'png',
    rendererOpts: {
      quality: 1,
    }
  });

  const img = await imagenLoaded(imageBase64);

  ctx.clearRect(0, 0, 341, 213);
  ctx.fillStyle = findRifa.color;
  ctx.fillRect(0, 0, 341, 213);
  ctx.drawImage(imagen, 0, 0/* , 341, 213 */);
  ctx.fillRect(227.5, 40, 105, 25);
  ctx.drawImage(img, 220, 70, 120, 120);

  ctx.font = "bold 18px serif";
  ctx.fillStyle = "black";
  ctx.fillText(findRifa.fecha, 227.5, 60);

  ctx.font = "bold 24px serif";
  ctx.fillStyle = findRifa.color;
  ctx.fillRect(147.5, 87.5, 65, 22.5);
  ctx.fillStyle = "black";
  ctx.fillText(element.premioMayor, 155, 105);
  ctx.fillStyle = findRifa.color;
  ctx.fillRect(142.5, 140, 65, 22.5);
  ctx.fillStyle = "black";
  ctx.fillText(element.premioMenor, 150, 157);

  return pdfDoc.embedPng(canvas.toDataURL("image/png"));
};

///////////////////////////////////////////////////////////////////


const { Meta } = Card;


const CardRifa: React.FC<{ rifa: any, formRifa: any }> = ({ rifa, formRifa }: any) => {

  var canvas: any, ctx: any;

  const descargarBoletos = async (boletos: any[]) => {

    pdfDoc = await PDFDocument.create();

    let widthPDF = 767.25, heightPDF = 958.5;
    let page = pdfDoc.addPage([widthPDF, heightPDF]);
    let x = 0;
    let y = widthPDF + 32/* - (159.75 * 4) */;
    let fila = 1;
    let numeroBoletos = 1;

    const boletosImages: any = [];
    for (const boleto of boletos) {

      const imagePng = await crearBoleto(
        boleto,
        canvas,
        ctx,
        rifa
      );
      boletosImages.push(imagePng);
    }

    for (const [i, boletoImage] of boletosImages.entries()) {
      const jpgDims = boletoImage.scale(0.75);

      page.drawImage(boletoImage, {
        x: x,
        y: y,
        width: jpgDims.width,
        height: jpgDims.height,
      });

      if (fila === 3) {
        x = 0;
        y -= (jpgDims.height + 0);
        fila = 1;
      } else {
        x += jpgDims.width + 0;
        fila++;
      }

      if (numeroBoletos === 18) {
        x = 0;
        y = widthPDF + 32/* - (jpgDims.height * 4) */;

        if (i < boletosImages.length - 1) {
          page = pdfDoc.addPage([widthPDF, heightPDF]);
        }

        numeroBoletos = 1;
      } else {
        numeroBoletos++;
      }
    }

    (() => {
      setloading(false);
      // Dibuja todo el canvas de color de la rifa
      ctx.fillStyle = rifa.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Dibuja la imagen en el canvas
      ctx.drawImage(imagen, 0, 0);
      // Dibuja el rectangulo para tapar la fecha
      ctx.fillRect(227.5, 40, 105, 25);
      // Dibuja el cuadrado para taparel qr
      ctx.font = "bold 48px serif";
      ctx.fillStyle = "white";
      ctx.fillRect(227.5, 75, 105, 105);
      // Dibuja el texto en el qr
      ctx.fillStyle = rifa.color;
      ctx.fillText("¿...?", 240, 140);

      // Dibuja el texto de la fecha
      ctx.font = "bold 16px serif";
      ctx.fillStyle = "white";
      ctx.fillText(rifa.fecha, 245, 60);
    })();

    const pdfBytes = await pdfDoc.save();

    // Crear un Blob con los datos del PDF
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Crear una URL a partir del Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Rifa-${rifa.fecha}.pdf`; // Nombre del archivo que se descargará
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(pdfUrl);
    // Abrir una nueva pestaña con el PDF
    // window.open(pdfUrl);
  };

  const router = useRouter();
  const dispatch = useDispatch();

  const [listarBoletos, {
    data,
    error,
    isLoading
  }] = useListarBoletosMutation();

  React.useEffect(() => {

    canvas = document.getElementById(rifa._id);
    ctx = canvas.getContext('2d');

    // Carga la imagen
    imagen = new Image();
    imagen.onload = function () {
      // Dibuja todo el canvas de color de la rifa
      ctx.fillStyle = rifa.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Dibuja la imagen en el canvas
      ctx.drawImage(imagen, 0, 0);
      // Dibuja el rectangulo para tapar la fecha
      ctx.fillRect(227.5, 40, 105, 25);
      // Dibuja el cuadrado para taparel qr
      ctx.font = "bold 48px serif";
      ctx.fillStyle = "white";
      ctx.fillRect(227.5, 75, 105, 105);
      // Dibuja el texto en el qr
      ctx.fillStyle = rifa.color;
      ctx.fillText("¿...?", 240, 140);

      // Dibuja el texto de la fecha
      ctx.font = "bold 16px serif";
      ctx.fillStyle = "white";
      ctx.fillText(rifa.fecha, 245, 60);
    };
    imagen.src = '../../ticket_mini_transparente.png';
  }, [rifa._id, rifa.color]);


  const [loading, setloading] = React.useState(false);

  return (
    <Card
      onClick={() => {
        router.push(`./${rifa._id}`);
      }}
      hoverable
      style={{ width: "100%" }}
      cover={<canvas id={rifa._id} height={213} width={341} style={{ borderRadius: ".5rem .5rem 0 0" }}></canvas>}
      actions={[
        <Tooltip title="Editar">
          <Button type="primary" onClick={(e) => {
            e.stopPropagation();
            dispatch(setOpenFormRifa(true));
            formRifa.resetFields();
            formRifa.setFieldsValue(rifa);
          }} shape="circle" icon={<EditOutlined />} />
        </Tooltip>,
        <Tooltip title="Descargar">
          <Button loading={loading} type="primary" onClick={async (e) => {
            e.stopPropagation();
            setloading(true);
            const { data = [] }: any = await listarBoletos({ _idRifa: rifa._id });
            dispatch(setListaDeBoletos(data));
            await descargarBoletos(data);

          }} shape="circle" icon={<CloudDownloadOutlined />} />
        </Tooltip>,
        <Tooltip title="2N° ganadores">
          <Button type="primary" onClick={async (e) => {
            e.stopPropagation();
            dispatch(setOpenFormBoleto(true));
            dispatch(setRifaDetalles(rifa));
          }} shape="circle" icon={<EyeOutlined />} />
        </Tooltip>,
      ]}
    >
      <Meta
        title={`Premio : ${rifa?.premio.toFixed(2)}`}
      />
      <Meta description={`Fecha : ${rifa?.fecha}`} />
      <Meta description={`Nombre : ${rifa?.nombre}`} />
      <Meta description={rifa?.descripcion} />
    </Card>
  )
};

export default CardRifa;