"use client";
import * as React from 'react';
import { Alert, Button, Col, Divider, Flex, List, Row, Select, notification } from 'antd';
import { useBuscarBoletoMutation, useListarBoletosPagadosMutation, usePagarBoletoMutation } from '@/services/userApi';
import { BrowserCodeReader, MultiFormatReader, BrowserQRCodeReader } from '@zxing/library';
import {
  DollarOutlined,
  QrcodeOutlined
} from '@ant-design/icons';

var selectedDeviceId: any;
var valueQR: string = "";

const Premios = () => {

  const videoRef = React.useRef<any>(null);
  const audioRef = React.useRef<any>(null);
  const codeReader = React.useRef<any>(new BrowserQRCodeReader());

  const [buscarBoleto, { data, error, isLoading }] = useBuscarBoletoMutation();
  const [listarBoletosPagados, { data: dataList = [], error: errorList, isLoading: isLoadingList }] = useListarBoletosPagadosMutation();
  const [pagarBoleto, { data: dataPagar, error: errorPagar, isLoading: isLoadingPagar }] = usePagarBoletoMutation();

  // notificaciones
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (data: any) => {
    api.info({
      message: `Boleto : ${data?.premioMenor} pagado!`,
      description: 'El boleto fue pagado, se listará en premios pagados, gracias!',
      placement: 'bottomRight',
    });
  };
  // notificaciones end

  React.useEffect(() => {
    (async () => {
      await listarBoletosPagados({});
    })();
  }, []);

  function decodeContinuously(codeReader: any, selectedDeviceId: any) {
    codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, videoRef.current, async (result: any, err: any) => {
      if (result) {
        if (result.text.toString() != valueQR.toString()) {
          audioRef.current.play();
          valueQR = result.text.toString();
          const findBoleto = await buscarBoleto({ _id: result.text.split("/").reverse()[0] });
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

  const [selectValue, setSelectValue] = React.useState(undefined);
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    function handleScreenChange(e: any) {
      setIsLargeScreen(e.matches);
    }

    mediaQuery.addListener(handleScreenChange); // Escuchar cambios en la pantalla
    handleScreenChange(mediaQuery); // Ejecutar la función inicialmente

    // Limpiar el listener al desmontar el componente
    return () => {
      mediaQuery.removeListener(handleScreenChange);
    };
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
            }} type="primary" block danger>
              Detener cámara
            </Button>
          </Flex>


          <video ref={videoRef} style={{ width: "100%", borderStyle: "dashed", borderRadius: ".5rem", marginBottom: ".5rem" }} />
          {(data && data.estadoMenor) && (
            <>
              <Alert
                closable
                style={{ marginBottom: ".5rem" }}
                message={`Boleto : ${data?.premioMenor}`}
                description="Aun no ha sido jugado!"
                type="info"
                showIcon
              />
            </>
          )}

          {(data && !data.estadoMenor && data.estadoPago) && (
            <>
              <Alert
                closable
                style={{ marginBottom: ".5rem" }}
                message={`Boleto : ${data?.premioMenor}`}
                description="Ya ha sido pagado!"
                type="warning"
                showIcon
              />
            </>
          )}

          {(data && !data.estadoMenor && !data.estadoPago) && (
            <>
              <Alert
                closable
                style={{ marginBottom: ".5rem" }}
                message={`Boleto : ${data?.premioMenor}`}
                description={Boolean(data?.premio) ? `Premio de ${data?.premio.toFixed(2)} pendiente de pago!` : "Este boleto no tuvo premio."}
                type={Boolean(data?.premio) ? "success" : "warning"}
                showIcon
              />
              {!data.estadoPago && (
                <Flex vertical gap="small" style={{ width: '100%' }}>
                  <Button icon={<DollarOutlined />} onClick={async () => {
                    await pagarBoleto({ _id: data._id });
                    await listarBoletosPagados({});
                    await buscarBoleto({ _id: data._id });
                    openNotification(data);
                  }} type="primary" block>
                    Pagar
                  </Button>
                </Flex>
              )}
            </>
          )}
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={0} lg={8}>
          <audio style={{ display: "none" }} ref={audioRef}>
            <source src="../../../store-scanner-beep-90395.mp3" type="audio/mpeg" />
          </audio>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={8}>
          {contextHolder}
          {isLargeScreen && <Divider>2N° ganadores</Divider>}
          <Select
            showSearch
            allowClear
            value={selectValue}
            onChange={(data: any) => {
              setSelectValue(data);
            }}
            style={{ width: "100%", marginBottom: ".5rem" }}
            placeholder="Seleccione rifa"
            optionFilterProp="children"
            filterOption={(input: any, option: any) => (option?.label ?? '').includes(input)}
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: '1',
                label: 'Not Identified',
              },
              {
                value: '2',
                label: 'Closed',
              },
              {
                value: '3',
                label: 'Communicated',
              },
              {
                value: '4',
                label: 'Identified',
              },
              {
                value: '5',
                label: 'Resolved',
              },
              {
                value: '6',
                label: 'Cancelled',
              },
            ]}
          />
          <List
            size="small"
            header={<div>{`Lista de boletos pagados : ${dataList.length}`}</div>}
            bordered
            dataSource={dataList}
            renderItem={(item: any) => (
              <List.Item>{`Boleto : ${item.premioMenor} Premio: ${item.premio.toFixed(2)} pagado!`}</List.Item>
            )}
          />
        </Col>

      </Row>
    </React.Suspense>
  )
};

export default Premios;



