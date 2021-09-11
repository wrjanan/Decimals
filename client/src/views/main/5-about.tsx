import React from 'react'
import { Row, Col } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";

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
        </Col>
      </Row>
    </>
  );
}

export default About;
