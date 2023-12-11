"use client";
import React from 'react';
const QrReader = require('react-qr-scanner');


const page = () => {
  const previewStyle = {
    height: 240,
    width: 320,
  };

  const [result, setResult] = React.useState('No result');


  function handleScan(data: any) {
    setResult(data);
  }
  function handleError(err: any) {
    console.error(err)
  }
  return (
    <div>
      <QrReader
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{result}</p>
    </div>
  )
}

export default page
