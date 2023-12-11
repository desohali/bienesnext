"use client";
import React, { useRef, useEffect } from 'react';
import { BrowserCodeReader, MultiFormatReader } from '@zxing/library';

const Scanner = () => {
  const videoRef = useRef<any>(null);
  const codeReader = useRef(new BrowserCodeReader(new MultiFormatReader()));
  const [text, settext] = React.useState<string>("second");
  useEffect(() => {
    let scanning = true;

    codeReader.current.listVideoInputDevices()
      .then((videoInputDevices) => {
        const rearCamera = videoInputDevices.find(device => device.label.includes('back'));
        if (rearCamera) {
          const startScanning = () => {
            codeReader.current.decodeFromInputVideoDevice(rearCamera.deviceId, videoRef.current)
              .then((result: any) => {
                console.log('Código leído:', result.text);
                // Hacer algo con el código leído
                if (result.text !== text) {
                  settext(result.text);
                  startScanning();
                }

                //  // Reiniciar el escaneo para leer el siguiente código

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

  return <>
    <video ref={videoRef} />
    <h4>{text.split("/").reverse()[0]}</h4>
  </>;
};

export default Scanner;



