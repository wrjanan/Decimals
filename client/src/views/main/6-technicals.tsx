import React from 'react'
import { Row, Col } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import { ReactComponent as Discord } from '../../images/discord.svg';

const svgStyle = {
}

const Technicals = (): React.ReactElement => {
  return (
    <>
      <Row justify="center">
        <Col xs={20} md={12}>
          <Title>Derivatives</Title>
          <h2>Derivative Projects</h2>
          <p>
            Let us know on discord <Discord className="hoverable" style={svgStyle} onClick={()=> window.open('https://discord.gg/r4xkqB6FcT')}/>   :)
          </p>
        </Col>
      </Row>
    </>
  );
}

export default Technicals;
