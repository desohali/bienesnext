"use client"
import React from 'react';
import { AutoComplete } from 'antd';

// Crear cadena de la 'a' a la 'z'
let alfabeto = '';
for (let i = 97; i <= 122; i++) {
  alfabeto += String.fromCharCode(i);
}

// Generar una palabra aleatoria
function generarPalabra(longitud:number) {
  let palabra = '';
  for (let i = 0; i < longitud; i++) {
    palabra += alfabeto.charAt(Math.floor(Math.random() * alfabeto.length));
  }
  return palabra;
}



const options:any = [
  
];
for (let index = 0; index < 5000; index++) {
  options.push({value: generarPalabra(5)})
  
}

const App: React.FC = () => (
  <AutoComplete
  allowClear
  bordered
  
    style={{ width: 200 }}
    options={options}
    onSelect={(data) => {
      console.log('onSelect', data);
    }}
    placeholder="try to type `b`"
    filterOption={(inputValue, option:any) =>
      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
);

export default App;