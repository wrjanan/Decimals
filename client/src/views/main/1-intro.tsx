import { Row, Col, Button, Divider } from "antd";
import MintPopover from "../components/MintPopover";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import { DownloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useContractContext } from "../../context/contract-context";

const Intro = (): React.ReactElement => {
  const { contracts, fetchContract } = useContractContext();
  const [maxDecimals, setMaxDecimals] = useState('');
  const [mintedDecimals, setMintedDecimals] = useState('');
  const contract = contracts.DecimalsContract;

  useEffect(() => {
    const getMaxDecimals = async () => {
      if (!contract) {
        await fetchContract();
      } else {
        setMaxDecimals(await contract?.methods.MAX_NFT_SUPPLY().call());
        setMintedDecimals(await contract?.methods.totalSupply().call());
      }
    }
    getMaxDecimals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  return (
    <>
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col span={24}>
          <object onClick={()=> window.open('https://www.twitter.com/The_Decimals')}>
            <svg className="hoverable" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
          </object>
          <Divider type="vertical" style={{borderTop:"none"}} />
          <Divider type="vertical" style={{borderTop:"none"}} />
          <object onClick={()=> window.open('https://discord.gg/r4xkqB6FcT')}>
            <svg className="hoverable" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.552 6.712c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888.008-.488-.36-.888-.816-.888zm2.92 0c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888s-.36-.888-.816-.888z" />
              <path d="M13.36 0H2.64C1.736 0 1 .736 1 1.648v10.816c0 .912.736 1.648 1.64 1.648h9.072l-.424-1.48 1.024.952.968.896L15 16V1.648C15 .736 14.264 0 13.36 0zm-3.088 10.448s-.288-.344-.528-.648c1.048-.296 1.448-.952 1.448-.952-.328.216-.64.368-.92.472-.4.168-.784.28-1.16.344a5.604 5.604 0 0 1-2.072-.008 6.716 6.716 0 0 1-1.176-.344 4.688 4.688 0 0 1-.584-.272c-.024-.016-.048-.024-.072-.04-.016-.008-.024-.016-.032-.024-.144-.08-.224-.136-.224-.136s.384.64 1.4.944c-.24.304-.536.664-.536.664-1.768-.056-2.44-1.216-2.44-1.216 0-2.576 1.152-4.664 1.152-4.664 1.152-.864 2.248-.84 2.248-.84l.08.096c-1.44.416-2.104 1.048-2.104 1.048s.176-.096.472-.232c.856-.376 1.536-.48 1.816-.504.048-.008.088-.016.136-.016a6.521 6.521 0 0 1 4.024.752s-.632-.6-1.992-1.016l.112-.128s1.096-.024 2.248.84c0 0 1.152 2.088 1.152 4.664 0 0-.68 1.16-2.448 1.216z" />
            </svg>
          </object>
          <Divider style={{borderTop:"none"}}/>
          <Divider style={{borderTop:"none"}}/>
          <Divider style={{borderTop:"none"}}/>
          <Title>
            Total Minted Decimals
          </Title>
          <h2>
            {mintedDecimals} / {maxDecimals}
          </h2>
          <MintPopover>
            <Button type="primary" shape="round" icon={<DownloadOutlined />} size={"large"} className="hoverable">Mint</Button>
          </MintPopover>
        </Col>
      </Row>
    </>
  );
}

export default Intro;
