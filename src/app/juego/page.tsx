"use client";
import * as React from 'react';
import { Alert, Button, Col, Input, QRCode, Row, Space, notification } from 'antd';
const p5 = require("p5");
/* import "../../globals.css" */
import { SketchOutlined } from '@ant-design/icons';
import { NotificationPlacement } from 'antd/es/notification/interface';
/* import '../../test.css';
 */

var animateH: any;
var sketch: any;
const SnowEffect = ({ params }: any) => {
  React.useEffect(() => {
    let snowflakes: Snowflake[] = [];
    let xText: any;
    let yText: any;
    let textWidth: any;
    let textHeight: any;
    let angle = 0;

    class Snowflake {
      posX: number;
      posY: number;
      initialPosY: number;
      size: number;
      radius: number;

      constructor() {
        this.posX = Math.random() * window.innerWidth;
        this.initialPosY = Math.random() * -50;
        this.posY = this.initialPosY;
        this.size = Math.random() * 3 + 2;
        this.radius = Math.sqrt(Math.random() * Math.pow(window.innerWidth, 2));
      }

      update(time: number) {
        this.posY += Math.pow(this.size, 1.5);

        if (this.posY > window.innerHeight) {
          let index = snowflakes.indexOf(this);
          snowflakes.splice(index, 1);
        }
      }

      display(p: any) {
        p.fill(240);
        p.noStroke();
        p.ellipse(this.posX, this.posY, this.size);
      }
    }

    const getTextBounds = (p: any, message: string, x: number, y: number, size: number) => {
      p.textSize(size);
      const textWidth = p.textWidth(message);
      const textHeight = size * 0.8; // Estimación razonable para el texto centrado verticalmente
      return {
        x: x - textWidth / 2,
        y: y - textHeight / 2,
        w: textWidth,
        h: textHeight,
      };
    };

    sketch = (p: any) => {
      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.position(0, 0);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        xText = window.innerWidth / 2;
        yText = window.innerHeight / 4;
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        xText = window.innerWidth / 2;
        yText = window.innerHeight / 6;
      };

      p.draw = () => {
        p.background("teal");

        // Efecto de nieve
        let t = p.frameCount / 30;

        for (let i = 0; i < Math.random() * 5; i++) {
          snowflakes.push(new Snowflake());
        }

        for (let flake of snowflakes) {
          flake.update(t);
          flake.display(p);
        }
      };

    };


  }, []);
  const [text, setText] = React.useState(`${location.origin}/juego/${params._id}`);
  const [ticket, setTicket] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  const [animate, setAnimate] = React.useState<any>();

  React.useEffect(() => {
    (async () => {
      const formData = new FormData();
      formData.append("_id", params._id);

      const response = await fetch("https://yocreoquesipuedohacerlo.com/findTicket", {
        method: "post",
        body: formData
      });
      const json = await response.json();
      setTicket(json || {});
    })();
  }, []);


  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: `Notification ${placement}`,
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      placement,
    });
  };


  return (
    <Row>
      <Col xs={24} sm={3} md={6} lg={8}>

      </Col>
      <Col xs={24} sm={18} md={12} lg={8}>

        {("estado" in ticket && Boolean(ticket.estado)) && (
          <Alert
            message="Este ticket ya ha sido usado!"
            type="info"
          />
        )}

        <Space size={[8, 16]} wrap direction="vertical" align="center" style={{ width: "100%" }}>
          <QRCode
            /* status={qr} */
            size={240}
            errorLevel="H"
            value={text || '-'} />
          <Button
            type="primary"
            icon={<SketchOutlined />}
            loading={loading}
            onClick={() => {
              animateH = new p5(sketch);

              setTimeout(() => {
                notification.open({
                  placement: "top",
                  message: `${Boolean(ticket.premio) ? 'Ganaste!!' : 'Sigue participando!!'}`,
                  description: `${Boolean(ticket.premio) ? ticket.cantidadPremio.toFixed(2) : ''}`,
                });
                animateH.remove();

              }, 3000);


            }}
          >
            Jugar
          </Button>
        </Space>

      </Col>
      <Col xs={24} sm={3} md={6} lg={8}>

      </Col>
    </Row>
  )
};

export default SnowEffect;




