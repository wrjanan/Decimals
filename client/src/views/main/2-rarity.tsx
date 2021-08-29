import React from 'react'
import { Row, Col, Button } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import Text from 'antd/lib/typography/Text';

const Rarity = (): React.ReactElement => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Title>Rarity</Title>
          <h2>Traits</h2>
          <Row style={{ textAlign: 'center', justifyContent: "center", backgroundColor:"biege" }}>
            <Col><Button>Base Color</Button></Col>
            <Col><Button>Base Visor</Button></Col>
          </Row>
          <br></br>
          <h2>Attributes Count</h2>
          <Row style={{ textAlign: 'center', justifyContent: "center", backgroundColor:"biege" }}>
            <Col>
              <Text disabled>0</Text>
              <Text type="secondary">1</Text>
              <Text>2</Text>
              <Text>3</Text>
              <Text>4</Text>
              <Text>5</Text>
              <Text type="secondary">6</Text>
              <Text disabled>7</Text>
            </Col>
          </Row>
          <br></br>
          <h2>Attributes</h2>
          <Row style={{ textAlign: 'center', justifyContent: "center", backgroundColor:"biege" }}>
            <Col><Button>Headgear</Button></Col>
            <Col><Button>Ear Amplifier</Button></Col>
            <Col><Button>Antenna</Button></Col>
            <Col><Button>Eye Laser</Button></Col>
            <Col><Button>Mouth Guard</Button></Col>
            <Col><Button>Neck Guard</Button></Col>
            <Col><Button>Scar</Button></Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Rarity;
