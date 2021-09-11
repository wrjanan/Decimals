import { Row, Col, Button } from "antd";
import MintPopover from "../components/MintPopover";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import { DownloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useContractContext } from "../../context/contract-context";

const Intro = (): React.ReactElement => {
  const { contracts, fetchContract } = useContractContext();
  const [ maxDecimals, setMaxDecimals ] = useState('');
  const [ mintedDecimals, setMintedDecimals ] = useState('');
  const contract = contracts.DecimalsContract;

  useEffect(() => {
    const getMaxDecimals = async() => {
      if(!contract) {
        await fetchContract();
      }
      setMaxDecimals(await contract?.methods.MAX_NFT_SUPPLY().call());
      setMintedDecimals(await contract?.methods.totalSupply().call());
    }
    getMaxDecimals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Title>
            Total Minted Decimals
          </Title>
          <h2>
            {mintedDecimals} / {maxDecimals}
          </h2>
          <MintPopover>
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={"large"}>Mint</Button>
          </MintPopover>
        </Col>
      </Row>
    </>
  );
}

export default Intro;
