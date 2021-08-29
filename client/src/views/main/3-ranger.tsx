import { Row, Col, Button } from "antd";
import "../components/MintPopover.css";
import Title from "antd/lib/typography/Title";
import { useState, useEffect } from "react";
import { useContractContext } from "../../context/contract-context";
import RangerCard, { RangerCardProps } from "./RangerCard";
import ContractService from "../../service/ContractService";

const defaultRangerCardProps = {
  ranger: {
    owner:false,
    rangerToken: 0,
    rangerURI: "",
    rangerName: "",
    rangerDescription: "",
    rangerClaimableTokens: 0,
  }
}

const RangerGallery = (): React.ReactElement => {
  const { contracts, fetchContract } = useContractContext();
  const [ maxRangers, setMaxRangers ] = useState('');
  const [ mintedRangers, setMintedRangers ] = useState('');
  const contract = contracts.CyberPunkRangersContract;
  const contractTokens = contracts.CyberPunkRangersTokenContract;

  const [ randomRanger, setRandomRanger ] = useState<RangerCardProps>(defaultRangerCardProps);
  const [ isLoading, setIsLoading ] = useState(false);
  useEffect(() => {
    const getMaxRangers = async() => {
      if(!contract) {
        return fetchContract();
      } else {
        setMaxRangers(await contract?.methods.MAX_NFT_SUPPLY().call());
        setMintedRangers(await contract?.methods.totalSupply().call());
        getRanger(randomRanger.ranger.rangerToken);
      }
    }
    getMaxRangers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);


  const getAccumulatedTokens = async (index: number) => {
    const tokens = await contractTokens?.methods.accumulated(index).call();
    return tokens;
  }

  const getPunkDescription = async (index: number) => {
    return contract?.methods.tokenDescriptionByIndex(index).call();
  }

  const getRanger = async (tokenId: number) => {
    if(isLoading) return;

    setIsLoading(true);
    const rangerURI = await ContractService.getPunkURI(contract, tokenId);
    const rangerName = await contract?.methods.tokenNameByIndex(tokenId).call();
    const rangerTokens = await getAccumulatedTokens(tokenId);
    const rangerDescription = await getPunkDescription(tokenId);
    setRandomRanger({
      ranger: {
        ...randomRanger.ranger,
        rangerName: rangerName,
        rangerURI: rangerURI,
        rangerToken: tokenId,
        rangerDescription: rangerDescription,
        rangerClaimableTokens: rangerTokens,
      }
    });
    setIsLoading(false);
  }
  const getRandomRanger = async () => {
    // await contractTokens?.methods.setRangersAddress("0x32E971c70B34B8e77469a56558286562eC09E583").estimateGas().then((gas: any) => {
      //   console.log("gas estimation: ", gas)
      //   return contractTokens?.methods.setRangersAddress("0x32E971c70B34B8e77469a56558286562eC09E583").send({ from: account }).then((response: any) => {
        //     console.log("successful transaction", response);
        //   });
        // });
    const randomToken = Math.floor(Math.random() * parseInt(mintedRangers));
    return getRanger(randomToken);
  }
  return (
    <>
      <Row className="force-center">
        <Col span={24}>
          <Title>
            Random Ranger Gallery
          </Title>
          <Button onClick={getRandomRanger}>Get Random Cyber Punk Ranger</Button>
          <h2>
            {randomRanger.ranger.rangerToken} / {maxRangers}
          </h2>
          { ((parseInt(mintedRangers) || 0) > 0) && <RangerCard
            ranger={randomRanger.ranger} />
          }
        </Col>
      </Row>
    </>
  );
}

export default RangerGallery;
