import { Row, Col, Button, Layout } from "antd";
import MintPopover from "../components/MintPopover";
import "../components/MintPopover.css";
import background1 from "../../images/8.png";
import background2 from "../../images/10.png";
import background3 from "../../images/11.png";
import background4 from "../../images/15.png";
import background5 from "../../images/18.png";
import background6 from "../../images/24.png";
import Title from "antd/lib/typography/Title";
import logo from '../../logo.svg';
import { DownloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useContractContext } from "../../context/contract-context";
import ContractService from "../../service/ContractService";

const backgroundStyle = {
  width:"15vh", height:"15vh",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat"
}
const flippedStyle = {
  transform: "scaleX(-1)"
}

const Intro = (): React.ReactElement => {
  const { account, contracts, fetchContract } = useContractContext();
  const [ maxRangers, setMaxRangers ] = useState('');
  const [ mintedRangers, setMintedRangers ] = useState('');
  const contract = contracts.CyberPunkRangersContract;

  useEffect(() => {
    const getMaxRangers = async() => {
      if(!contract) {
        await fetchContract();
      }
      setMaxRangers(await contract?.methods.MAX_NFT_SUPPLY().call());
      setMintedRangers(await contract?.methods.totalSupply().call());
    }
    getMaxRangers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const setAddress = async () => {
    if(contracts.CyberPunkRangersContract?.options.address) {
      await contracts.CyberPunkRangersTokenContract?.methods.setRangersAddress(contracts.CyberPunkRangersContract?.options.address.toString()).estimateGas().then((gas: any) => {
        console.log("gas estimation: ", gas)
        return contracts.CyberPunkRangersTokenContract?.methods.setRangersAddress(contracts.CyberPunkRangersContract?.options.address.toString()).send({ from: account }).then((response: any) => {
          console.log("successful transaction", response);
        });
      });
    }
  }

  const setBaseUrl = async () => {
    await ContractService.setBaseURL(contract, account, "http://api.steambadgefinder.com/");
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <img src={logo} className="App-logo" alt="logo" />
          <Title>
            Total Minted Rangers
          </Title>
          <h2>
            {mintedRangers} / {maxRangers}
          </h2>
          <MintPopover>
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={"large"}>Mint</Button>
          </MintPopover>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>contracts</h2>
          <br />
          <p>NFT Contract: {contracts?.CyberPunkRangersContract?.options.address}</p>
          <br />
          <p>NFT Token Contract: {contracts?.CyberPunkRangersTokenContract?.options.address}</p>
          <br />
          <Button onClick={setAddress}>Set address</Button>
          <Button onClick={setBaseUrl}>Set BaseURLsetBaseUrl</Button>
        </Col>

      </Row>
      <Layout style={{ justifyContent: "flex-end" }}>

        <Row justify="space-around">
          <Col span={4} style={{...backgroundStyle, backgroundImage: `url(${background1})`}}></Col>
          <Col span={4} style={{...backgroundStyle, backgroundImage: `url(${background2})`}}></Col>
          <Col span={4} style={{...backgroundStyle, backgroundImage: `url(${background3})`}}></Col>
          <Col span={4} style={{...backgroundStyle, backgroundImage: `url(${background4})`, ...flippedStyle}}></Col>
          <Col span={4} style={{...backgroundStyle, backgroundImage: `url(${background5})`, ...flippedStyle}}></Col>
          <Col span={4} style={{...backgroundStyle, backgroundImage: `url(${background6})`, ...flippedStyle}}></Col>
        </Row>
      </Layout>
    </>
  );
}

export default Intro;
