import React from 'react'
import { Row, Col } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";

const Technicals = (): React.ReactElement => {
  return (
    <>
      <Row justify="center">
        <Col xs={20} md={12}>
          <Title>Geeky Stuff</Title>
          <h2>Technicals</h2>
          <p>It is a collection of 13691 unique programatically generated NFTs by a cyber punk ranger behind a mask.
            Owning a Cyber Punk Ranger entitles you to 1 ERC20 CyberPunkRangerToken (CPRT) per day.

            Minting a Cyber Punk Ranger entitles you to claim an initial 365 CPRT.

            Minting a Cyber Punk Ranger before our reveal time stamp entitles you to an initial 730 CPRT.

            Cyber Punk Rangers can each have a unique 25 char long name to be minted into the blockchain. however, each name change costs 365 CPRTs.

            Cyber Punk Rangers can also have a description / blurb.
            <br></br>

            *Changing name & descriptions costs gas fees, hence do mint at your own risk.
          </p>
          <h2>Roadmap</h2>
          <p>
            We are in pursuit of the concept of CyberPunkRangers.

            And hope to find budding stories within this realm.

            Hence forth we are will running blurb competitions.

            Where each Cyber Punk Ranger can vote for the best name / description combo.

            Proceeds from this sale will go to the winners.

            We will run this yearly on this website.

            Lookout for this space as future CyberPunkRangers projects!
          </p>
        </Col>
      </Row>
    </>
  );
}

export default Technicals;
