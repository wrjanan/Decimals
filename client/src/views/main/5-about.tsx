import React from 'react'
import { Row, Col } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import background3 from "../../images/11.png";

const About = (): React.ReactElement => {
  return (
    <>
      <Row justify="center">
        <Col xs={20} md={12}>

          <img src={background3} style={{maxWidth:"240px"}} alt="About"></img>
          <Title>About</Title>
          <h2>Cyber Punk Rangers</h2>
          <p>In the near future,
            we foresee a Cyber Punk Era.

            An era of genetic modifications and human evolution.

            With coorporations fueled by greed.

            This era calls for an uprising.

            Individuals from all walks of life, coming together in this Cyber Punk future

            Masking up to protect our individuality.

            Here we stand to be part of this dystopia.
          </p>
          <h2>Who we are</h2>
          <p>
            Cyber punk rangers represent believers of the privacy that comes with blockchain, and the power of NFTs in blockchain.

            We understand the idea that art pieces, are like time pieces, stones of history, hardened by the dust of Earth.

            Just like valuable time pieces, Cyber Punk Rangers, shall forever be part of history.

            Join us in building a piece of this masked adventurer.
          </p>
        </Col>
      </Row>
    </>
  );
}

export default About;
