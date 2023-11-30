"use client"
import Hola from '@/components/Hola'
import React from 'react'
import { useSelector } from 'react-redux';

const page = () => {
  const menuButtonKey = useSelector((state: any) => state.admin.menuButtonKey);
  console.log('menuButtonKey', menuButtonKey)
  return (
    <React.Suspense>
      <Hola />
    </React.Suspense>
  )
}

export default page