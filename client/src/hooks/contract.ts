import { useState, useEffect } from 'react';
import { Contract } from 'web3-eth-contract';
import Web3Hook from './web3';
import DecimalsContractJson from "../contracts/Decimals.json";

type ContractState = {
  DecimalsContract: Contract | null,
};

const ContractHook = (): ContractState => {
  const { isLoading, isWeb3, web3 } = Web3Hook();
  const [state, setState] = useState<ContractState>({
    DecimalsContract: null,
  });

  useEffect(() => {
    (async(): Promise<void> => {
      try {
        if(web3) {
          const deployedNetwork = DecimalsContractJson.networks[1631351044667];
          const abi: any = DecimalsContractJson.abi;
          const DecimalsContractNew = new web3.eth.Contract(
            abi,
            deployedNetwork && deployedNetwork.address
          );
          setState({ DecimalsContract: DecimalsContractNew });
        }
      } catch {
        setState({
          ...state,
        });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3, isLoading]);

  const { DecimalsContract } = state;
  return { DecimalsContract };
};
export default ContractHook;
