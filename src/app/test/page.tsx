"use client"
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;

const App: React.FC = ({ children }: any) => {
  const d = useSelector((state: any) => state.user.user)
  console.log('d', d)


  return (
    <h2>{d}</h2>
  );
};

export default App;