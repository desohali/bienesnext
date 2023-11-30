"use client";

import React, { useEffect, useRef } from 'react';
const p5 = require('p5');

interface Coin {
  posX: number;
  posY: number;
  speed: number;
  rotation: number;
}

const CoinRainEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let coins: Coin[] = [];

  useEffect(() => {
    const sketch = (p: any) => {
      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight).parent('coin-rain-container' as unknown as string);
      };

      p.draw = () => {
        p.background("teal");

        // Efecto de lluvia de monedas
        if (p.frameCount % 5 === 0) {
          let newCoin = {
            posX: p.random(p.width),
            posY: -20,
            speed: p.random(1, 3),
            rotation: p.random(p.TWO_PI), // Inicializar la rotación aleatoria
          };
          coins.push(newCoin);
        }

        for (let i = coins.length - 1; i >= 0; i--) {
          let coin = coins[i];
          coin.posY += coin.speed;

          // Moneda dorada
          p.push();
          p.fill(255, 215, 0);
          p.translate(coin.posX, coin.posY);
          p.rotate(coin.rotation);
          p.ellipseMode(p.CENTER);
          p.ellipse(0, 0, 20, 20); // Tamaño fijo de la moneda (ajusta según tus necesidades)
          p.pop();

          // Efecto de brillo
          for (let j = 0; j < 5; j++) {
            let sparkleX = coin.posX + p.cos(coin.rotation + j * p.TWO_PI / 5) * 8; // Ajusta el tamaño del brillo
            let sparkleY = coin.posY + p.sin(coin.rotation + j * p.TWO_PI / 5) * 8; // Ajusta el tamaño del brillo
            p.fill(255, 255, 255, p.random(150, 200));
            p.ellipse(sparkleX, sparkleY, 5, 5); // Tamaño del brillo
          }

          coin.rotation += 0.05; // Ajusta la velocidad de rotación aquí

          if (coin.posY > p.height + 20) { // Reemplaza 20 con el tamaño de la moneda
            coins.splice(i, 1);
          }
        }
      };
    };

    const myP5: any = new p5(sketch, canvasRef.current || undefined);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div id="coin-rain-container"><canvas ref={canvasRef} /></div>;
};

export default CoinRainEffect;
