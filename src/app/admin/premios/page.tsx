"use client";
import * as React from 'react';
import { Alert, Button, Col, Flex, Row } from 'antd';
import { useBuscarBoletoMutation } from '@/services/userApi';
import { BrowserCodeReader, MultiFormatReader } from '@zxing/library';
import {
  DollarOutlined
} from '@ant-design/icons';


const Premios = () => {
  const videoRef = React.useRef<any>(null);
  const codeReader = React.useRef(new BrowserCodeReader(new MultiFormatReader()));
  const [textQr, setTextQr] = React.useState<string>("");

  const [buscarBoleto, { data, error, isLoading }] = useBuscarBoletoMutation();

  React.useEffect(() => {
    let scanning = true;

    codeReader.current.listVideoInputDevices()
      .then((videoInputDevices) => {
        const rearCamera = videoInputDevices.find(device => device.label.includes('back'));

        if (rearCamera || (videoInputDevices && videoInputDevices.length)) {
          const startScanning = () => {
            codeReader.current.decodeFromInputVideoDevice((rearCamera?.deviceId || videoInputDevices[0].deviceId), videoRef.current)
              .then(async (result: any) => {
                if (result.text.toString() !== textQr.toString()) {
                  const findBoleto = await buscarBoleto({ _id: result.text.split("/").reverse()[0] });
                  setTextQr(result.text);
                  startScanning();
                }

              })
              .catch((err) => {
                console.error('Error de lectura:', err);
                if (scanning) {
                  startScanning(); // Intentar leer el siguiente código en caso de error
                }
              });
          };
          startScanning(); // Comenzar el escaneo inicial
        }
      })
      .catch((err) => {
        console.error('Error al listar cámaras:', err);
      });

    return () => {
      scanning = false; // Detener el escaneo al desmontar el componente
      codeReader.current.reset();
    };
  }, []);

  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={8}>
          <video ref={videoRef} style={{ width: "100%", borderStyle: "dashed", borderRadius: ".5rem", marginBottom: ".5rem" }} />
          {data && (
            <>
              <Alert
                style={{ marginBottom: ".5rem" }}
                message={`Boleto : ${data?.premioMenor}`}
                description={Boolean(data?.premio) ? `Premio de ${data?.premio} pendiente de pago!` : "Este boleto no tuvo premio."}
                type={Boolean(data?.premio) ? "success" : "warning"}
                showIcon
              />
              <Flex vertical gap="small" style={{ width: '100%' }}>
                <Button icon={<DollarOutlined />} type="primary" block>
                  Pagar
                </Button>
              </Flex>
            </>

          )}
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={16}>

        </Col>
      </Row>
    </React.Suspense>
  )
};

export default Premios;



