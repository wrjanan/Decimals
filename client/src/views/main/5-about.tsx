import React from 'react'
import { Row, Col, Divider } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import { ReactComponent as Decimals } from '../../images/decimals.svg';
import { ReactComponent as Decimals2 } from '../../images/decimals2.svg';

const svgStyle = {
  border: "1px solid black",
  borderRadius: "10%",
  margin: "10px",
}

const About = (): React.ReactElement => {
  return (
    <>
      <Row justify="center">
        <Col xs={20} md={12}>
          <Title>About</Title>
          <h2>Decimals</h2>
          <p>
            The true real numbers
          </p>
          <Divider style={{borderTop:"none"}} />
          <Row justify="center">
            <Col xs={20} md={12}>
              Decimals #8888
              <Decimals style={svgStyle}/>
            </Col>
            <Col xs={20} md={12}>
              Decimals #8889
              <Decimals2 style={svgStyle}/>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default About;
