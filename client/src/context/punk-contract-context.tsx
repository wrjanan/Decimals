import React, { PropsWithChildren, useCallback, useContext, useEffect } from "react";
import { Contract } from "web3-eth-contract";
import { ApiRequestStatus } from "../constants/api-request-status";
import { PunkState, reducer, SET_FAILED, SET_LOADING, SET_PUNK_CONTEXT } from "./punk-contract-reducer";
import CyberPunkRangersContract from "../contracts/CyberPunkRangers.json";
import { useWeb3Context } from "./web3-context";

export interface PunkContextState extends PunkState{
  getPunks: () => void
}

const initialState: PunkContextState = {
  cyberPunkRangerContract: null,
  punks: null,
  status: ApiRequestStatus.none,
  getPunks: (): void => {
    // intentional
  }
};

const PunkContext = React.createContext(initialState);

const usePunkContext = (): PunkContextState => useContext(PunkContext);

export const PunkContextProvider = ({ children }: PropsWithChildren<unknown>):React.ReactElement => {
  const [ state, dispatch ] = React.useReducer(reducer, initialState);
  const { web3, account } = useWeb3Context();
  const deployedNetwork = CyberPunkRangersContract.networks[5777];
  const abi: any = CyberPunkRangersContract.abi;

  const fetchingNow = React.useRef(false);

  const setContract = (): Contract | undefined => {
    if(web3) {
      const contract = new web3.eth.Contract(
        abi,
        deployedNetwork && deployedNetwork.address
      );
      dispatch({ type: SET_PUNK_CONTEXT, payload: { cyberPunkRangerContract: contract } });
      return contract;
    }
    return undefined;
  }

  useEffect(() => {
    fetchingNow.current = true;
    setContract();
    fetchingNow.current = false

    return () => {
      fetchingNow.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3])

  const fetchPunks = useCallback(async () => {
    let contract: Contract | undefined;
    if(!state.cyberPunkRangerContract) {
      console.log("state.cyberPunkRangerContract",state.cyberPunkRangerContract);
      contract = setContract();
      console.log("state.cyberPunkRangerContract",contract);
    } else {
      contract = state.cyberPunkRangerContract;
      console.log("existing contract", contract);
    }
    const results = await contract?.methods.balanceOf(account).call().then((accountPunks: any) => {
      console.log("accountPunks",accountPunks);

      const getPunkAddress = async (index: number) => {
        return contract?.methods.tokenOfOwnerByIndex(account, index).call();
      }
      const getPunkURI = async (index: number) => {
        return contract?.methods.tokenURI(index).call();
      }

      let promises = []
      for (let i = 0; i < accountPunks; i++) {
        promises.push(getPunkAddress(i));
      }
      return Promise.all(promises).then((result) => {
        console.log("result", result);
        const punkAddresses: any[] = [];
        result.forEach(punk => punkAddresses.push(punk));
        promises = [];
        console.log("punkAddresses", punkAddresses);
        for (let i = 0; i < punkAddresses.length; i++) {
          promises.push(getPunkURI(i));
        }
        return Promise.all(promises);
      })
    });
    console.log("results", results);
    return results;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getPunks = useCallback(async () => {
    console.log("fetchingNow", fetchingNow);
    if (fetchingNow.current) {
      return;    }

    fetchingNow.current = true;

    try {
      dispatch({ type: SET_LOADING });

      const punks = await fetchPunks();
      fetchingNow.current = false;
      dispatch({ type: SET_PUNK_CONTEXT, payload: punks });
    } catch (e) {
      console.log(e);
      fetchingNow.current = false;
      dispatch({ type: SET_FAILED });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <PunkContext.Provider value={{ ...state, getPunks}}>
      {children}
    </PunkContext.Provider>
  );
};

export default PunkContext;
export { usePunkContext };
