// Ejemplo de uso en Node.js
/* const jsQR = require('jsqr');
const qrImage = require('qr-image');
const qrCodeReader = require('qrcode-reader'); */
"use client"
// Ejemplo de uso en React (componente funcional)
/* const QrReader = require('react-qr-reader'); */import { QrReader } from 'react-qr-reader';

const MyQRReaderComponent = () => {
  const handleScan = (data:any) => {
    if (data) {
      // Hacer algo con el dato del código QR leído
      console.log(data);
    }
  }

  const handleError = (error:any) => {
    console.error(error);
  }

  return (
    <QrReader
      delay={300}
      onError={handleError}
      onScan={handleScan}
      style={{ width: '100%' }}
    />
  );
}

export default MyQRReaderComponent;
