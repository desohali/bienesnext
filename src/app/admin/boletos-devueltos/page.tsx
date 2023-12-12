"use client";
import * as React from 'react';
import { BrowserCodeReader, MultiFormatReader } from '@zxing/library';
import { Button, Col, Flex, Row } from 'antd';
import {
  SafetyOutlined
} from '@ant-design/icons';

const BoletosDEvueltos = () => {
  const videoRef = React.useRef<any>(null);
  const codeReader = React.useRef(new BrowserCodeReader(new MultiFormatReader()));
  const [text, settext] = React.useState<string>("");
  const [arrayQR, setArrayQR] = React.useState<string[]>([]);

  React.useEffect(() => {
    let scanning = true;

    codeReader.current.listVideoInputDevices()
      .then((videoInputDevices) => {
        const rearCamera = videoInputDevices.find(device => device.label.includes('back'));
        if (rearCamera || (videoInputDevices && videoInputDevices.length)) {
          const startScanning = () => {
            codeReader.current.decodeFromInputVideoDevice(rearCamera?.deviceId || videoInputDevices[0].deviceId, videoRef.current)
              .then((result: any) => {
                if (result.text.toString() !== text.toString()) {
                  setArrayQR((qrs: any) => [...qrs, result.text]);
                  settext(result.text);
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

          <div style={{ position: "relative", width: "100%" }}>
            <div style={{
              textAlign:"center",
              padding:"5px 0px",
              width: "30px",
              height: "30px",
              borderRadius: ".5rem",
              position: "absolute",
              bottom: 12,
              right: 0
            }}><strong>{arrayQR.length}</strong></div>
            <video ref={videoRef} style={{
              width: "100%",
              borderStyle: "dashed",
              borderRadius: ".5rem",
              marginBottom: ".5rem"
            }} />
          </div>


          <Flex vertical gap="small" style={{ width: '100%' }}>
            <Button icon={<SafetyOutlined />} type="primary" block>
              Validar
            </Button>
          </Flex>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={16}>

        </Col>
      </Row>
    </React.Suspense>
  )
};

export default BoletosDEvueltos;



