"use client";
import React from 'react';
import { Result, Spin } from 'antd';

const App: React.FC = () => {
  const [loading, setloading] = React.useState<Boolean>(true);
  React.useEffect(() => {
    setloading(false);
  }, []);
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="CARGANDO..." size="large" />
      </div>
    );
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="Lo sentimos, no está autorizado a acceder a esta página."
    />
  );
};

export default App;