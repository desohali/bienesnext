"use client";
import React, { useRef, useEffect } from 'react';
/* import Quagga from 'quagga'; */
const Quagga = require('quagga')
const BarcodeScanner = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: videoRef.current,
          constraints: {
            facingMode: 'environment', // Puede ser 'user' para la cámara frontal
          },
        },
        decoder: {
          readers: ['code_128_reader'], // Puedes especificar diferentes tipos de lectores aquí
        },
      },
      (err:any) => {
        if (err) {
          console.error('Error al inicializar Quagga:', err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data:any) => {
      console.log('Código de barras detectado:', data);
      // Aquí puedes manejar la información del código de barras detectado
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return <video ref={videoRef} />;
};

export default BarcodeScanner;
