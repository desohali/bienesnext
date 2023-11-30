"use client"
import Hola from '@/components/Hola'
import React from 'react'
import { useSelector } from 'react-redux';

const App: React.FC = () => {
  const menuButtonKey = useSelector((state: any) => state.admin.menuButtonKey);
  return (
    <React.Suspense>
      <Hola />
    </React.Suspense>
  )
}

export default App;