"use client";
import * as React from 'react';
import { Alert, Button, Col, Flex, List, Row, Select, notification } from 'antd';
import { useBuscarBoletoMutation, useListarBoletosPagadosMutation, usePagarBoletoMutation } from '@/services/userApi';
import { BrowserCodeReader, MultiFormatReader } from '@zxing/library';
import {
  DollarOutlined
} from '@ant-design/icons';


const Premios = () => {
  const videoRef = React.useRef<any>(null);
  const codeReader = React.useRef(new BrowserCodeReader(new MultiFormatReader()));
  const [textQr, setTextQr] = React.useState<string>("");

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

  const [selectValue, setSelectValue] = React.useState(undefined);
console.log('selectValue', selectValue)
  return (
    <React.Suspense>
      <Row gutter={16}>

        <Col className="gutter-row" xs={24} sm={24} md={12} lg={8}>
          <video ref={videoRef} style={{ width: "100%", borderStyle: "dashed", borderRadius: ".5rem", marginBottom: ".5rem" }} />
          {(data && data.estadoMenor) && (
            <>
              <Alert
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
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={8}></Col>
        <Col className="gutter-row" xs={24} sm={24} md={12} lg={8}>
          {contextHolder}

          <List
            size="small"
            header={<div>
              {/* {`Lista de boletos pagados : ${dataList.length}`} */}
              <Select
                showSearch
                allowClear
                value={selectValue}
                onChange={(data: any) => {
                  setSelectValue(data);
                }}
                style={{ width: "100%" }}
                placeholder="Search to Select"
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
            </div>}
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



