"use client";
import React from 'react';
import { EyeOutlined, EditOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { setListaDeBoletos, setOpenFormBoleto, setOpenFormRifa, setRifaDetalles } from '@/features/adminSlice';
import { useDispatch } from 'react-redux';
import { useListarBoletosMutation } from '@/services/userApi';


const { Meta } = Card;

const CardRifa: React.FC<{ rifa: any, formRifa: any }> = ({ rifa, formRifa }: any) => {

  const router = useRouter();
  const dispatch = useDispatch();

  const [listarBoletos, {
    data: dataMu,
    error: errorMU,
    isLoading: isLoadingMu
  }] = useListarBoletosMutation();

  React.useEffect(() => {

    let canvas: any = document.getElementById(rifa._id);
    let ctx = canvas.getContext('2d');

    // Carga la imagen
    let imagen = new Image();
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
  const descargarBoletos = async (rifa: any) => {
    setloading(true);
    const formData = new FormData();
    formData.append("_idRifa", rifa._id);
    const response = await fetch(`http://localhost:4000/descargarBoletos`, {
      method: "post",
      body: formData
    });
    const blob = await response.blob();
    // Crea un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rifa-${rifa.fecha}.pdf`; // Nombre del archivo que se descargará
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setloading(false);
  }

  return (
    <Card
      onClick={() => {
        router.push(`./admin/${rifa._id}`);
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
            await descargarBoletos(rifa);
          }} shape="circle" icon={<CloudDownloadOutlined />} />
        </Tooltip>,
        <Tooltip title="2N° ganadores">
          <Button type="primary" onClick={async (e) => {
            e.stopPropagation();
            const { data = [] }: any = await listarBoletos({ _idRifa: rifa._id });
            dispatch(setListaDeBoletos(data));

            dispatch(setOpenFormBoleto(true));
            dispatch(setRifaDetalles(rifa));
          }} shape="circle" icon={<EyeOutlined />} />
        </Tooltip>,
      ]}
    >
      <Meta
        title={`Premio : ${rifa?.premio.toFixed(2)}`}
        description={`2N° ganadores : ${rifa?.cantidadGanadores}`}
      />
      <Meta description={`Fecha : ${rifa?.fecha}`} />
      <Meta description={`Nombre : ${rifa?.nombre}`} />
      <Meta description={rifa?.descripcion} />
    </Card>
  )
};

export default CardRifa;