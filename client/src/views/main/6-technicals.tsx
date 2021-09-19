import React from 'react'
import { Row, Col } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import { ReactComponent as Discord } from '../../images/discord.svg';

const json: DerivativesJson = require(`${process.env.PUBLIC_URL || "../.."}/derivatives/db.json`);

type DerivativesJson = {
  [name: string]: DerivativesProject[]
}

type DerivativesProject = {
  name: string,
  weblink: string
}

const svgStyle = {
  border: "1px solid black",
  borderRadius: "5%",
  margin: "20px",
  padding: "20px",
}

const Technicals = (): React.ReactElement => {
  const showDerivatives = () => {
    const derivativeCategories = Object.keys(json);
    const reactNodes = [];
    for (const index in derivativeCategories) {
      reactNodes.push(<p>{derivativeCategories[index]}</p>)
      json[derivativeCategories[index]]?.forEach((project: DerivativesProject): void => {
        reactNodes.push(<>
          <p><a href={project.weblink} target="_blank" rel="noopener noreferrer">{project.name}</a></p>
        </>);
      })
    }
    return reactNodes;
  }

  return (
    <>
      <Row justify="center">
        <Col xs={20} md={12}>
          <Title>Derivatives</Title>
          <h2>Derivative Projects</h2>
          <p>
            Let us know on discord <Discord className="hoverable" onClick={() => window.open('https://discord.gg/r4xkqB6FcT')} />   :)
          </p>
          <br />
          <div style={svgStyle}>
            {showDerivatives()}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Technicals;
