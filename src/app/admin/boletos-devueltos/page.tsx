"use client";
import * as React from 'react';
import { BrowserQRCodeReader, MultiFormatReader } from '@zxing/library';
import { Button, Col, Flex, Row } from 'antd';
import {
  DollarOutlined,
  QrcodeOutlined,
  SafetyOutlined
} from '@ant-design/icons';

var selectedDeviceId: any;
var valueQR: string = "";

const BoletosDEvueltos = () => {

  const videoRef = React.useRef<any>(null);
  const audioRef = React.useRef<any>(null);
  const codeReader = React.useRef<any>(new BrowserQRCodeReader());

  const [arrayQR, setArrayQR] = React.useState<string[]>([]);

  function decodeContinuously(codeReader: any, selectedDeviceId: any) {
    codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, videoRef.current, async (result: any, err: any) => {
      if (result) {
        if (result.text.toString() != valueQR.toString()) {
          audioRef.current.play();
          valueQR = result.text.toString();
          setArrayQR((qrs: any) => [...qrs, result.text.toString()]);
        }
      }
    });
  };

  React.useEffect(() => {
    codeReader.current.getVideoInputDevices()
      .then((videoInputDevices: any) => {
        const rearCamera = videoInputDevices.find((device: any) => device.label.includes('back'));
        selectedDeviceId = (rearCamera?.deviceId || videoInputDevices[0].deviceId);
      });
    return () => {
      codeReader.current.reset();
    }
  }, []);

  return (
    <React.Suspense>
      <Row gutter={16}>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={8}>
          <Flex gap="small" style={{ width: '100%', marginBottom: ".5rem" }}>
            <Button icon={<QrcodeOutlined />} onClick={() => {
              decodeContinuously(codeReader.current, selectedDeviceId);
            }} type="primary" block>
              Iniciar cámara
            </Button>
            <Button icon={<QrcodeOutlined />} onClick={() => {
              codeReader.current.reset();
              setArrayQR([]);
            }} type="primary" block danger>
              Detener cámara
            </Button>
          </Flex>
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{
              textAlign: "center",
              padding: "0px",
              width: "40px",
              height: "40px",
              borderRadius: ".5rem",
              position: "absolute",
              bottom: 12,
              right: 0
            }}><strong style={{ fontSize: "1.5rem" }}>{arrayQR.length}</strong></div>
            <video ref={videoRef} style={{
              width: "100%",
              borderStyle: "dashed",
              borderRadius: ".5rem",
              marginBottom: ".5rem"
            }} />
          </div>

          <Flex vertical gap="small" style={{ width: '100%' }}>
            <Button icon={<SafetyOutlined />} onClick={() => {

            }} type="primary" block>
              Validar
            </Button>
          </Flex>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={16}>
          <audio style={{ display: "none" }} ref={audioRef}>
            <source src="../../../store-scanner-beep-90395.mp3" type="audio/mpeg" />
          </audio>
        </Col>
      </Row>
    </React.Suspense>
  )
};

export default BoletosDEvueltos;



