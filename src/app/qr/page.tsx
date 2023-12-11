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
        if (videoInputDevices && videoInputDevices.length > 0) {
          // Iniciar el escaneo continuo
          const startScanning = () => {
            codeReader.current.decodeFromInputVideoDevice(videoInputDevices[0].deviceId, videoRef.current)
              .then((result:any) => {
                console.log('Código leído:', result.text);
                // Hacer algo con el código leído
                settext(result.text)
                if (scanning) {
                  startScanning(); // Reiniciar el escaneo para leer el siguiente código
                }
              })
              .catch((err) => {
                console.error('Error de lectura:', err);
                if (scanning) {
                  startScanning(); // Intentar leer el siguiente código en caso de error
                }
              });
          };

          startScanning(); // Comenzar el escaneo continuo
        } else {
          console.error('No se encontraron cámaras disponibles.');
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

  return <video ref={videoRef} />;
};

export default Scanner;



