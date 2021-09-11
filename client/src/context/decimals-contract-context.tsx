import React, { PropsWithChildren, useCallback, useContext, useEffect } from "react";
import { Contract } from "web3-eth-contract";
import { ApiRequestStatus } from "../constants/api-request-status";
import { DecimalsContractState, reducer, SET_FAILED, SET_LOADING, SET_DECIMALS_CONTEXT } from "./decimals-contract-reducer";
import DecimalsContract from "../contracts/Decimals.json";
import { useWeb3Context } from "./web3-context";

export interface DecimalContextState extends DecimalsContractState{
  getDecimals: () => void
}

const initialState: DecimalContextState = {
  DecimalsContract: null,
  decimals: null,
  status: ApiRequestStatus.none,
  getDecimals: (): void => {
    // intentional
  }
};

const DecimalContext = React.createContext(initialState);

const useDecimalContext = (): DecimalContextState => useContext(DecimalContext);

export const DecimalContextProvider = ({ children }: PropsWithChildren<unknown>):React.ReactElement => {
  const [ state, dispatch ] = React.useReducer(reducer, initialState);
  const { web3, account } = useWeb3Context();
  const deployedNetwork = DecimalsContract.networks[1631351044667];
  const abi: any = DecimalsContract.abi;

  const fetchingNow = React.useRef(false);

  const setContract = (): Contract | undefined => {
    if(web3) {
      const contract = new web3.eth.Contract(
        abi,
        deployedNetwork && deployedNetwork.address
      );
      dispatch({ type: SET_DECIMALS_CONTEXT, payload: { DecimalsContract: contract } });
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

  const fetchDecimals = useCallback(async () => {
    let contract: Contract | undefined;
    if(!state.DecimalsContract) {
      console.log("state.DecimalsContract",state.DecimalsContract);
      contract = setContract();
      console.log("state.DecimalsContract",contract);
    } else {
      contract = state.DecimalsContract;
      console.log("existing contract", contract);
    }
    const results = await contract?.methods.balanceOf(account).call().then((accountDecimals: any) => {
      console.log("accountDecimals",accountDecimals);

      const getDecimalAddress = async (index: number) => {
        return contract?.methods.tokenOfOwnerByIndex(account, index).call();
      }
      const getDecimalURI = async (index: number) => {
        return contract?.methods.tokenURI(index).call();
      }

      let promises = []
      for (let i = 0; i < accountDecimals; i++) {
        promises.push(getDecimalAddress(i));
      }
      return Promise.all(promises).then((result) => {
        console.log("result", result);
        const decimalAddresses: any[] = [];
        result.forEach(decimal => decimalAddresses.push(decimal));
        promises = [];
        console.log("decimalAddresses", decimalAddresses);
        for (let i = 0; i < decimalAddresses.length; i++) {
          promises.push(getDecimalURI(i));
        }
        return Promise.all(promises);
      })
    });
    console.log("results", results);
    return results;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getDecimals = useCallback(async () => {
    console.log("fetchingNow", fetchingNow);
    if (fetchingNow.current) {
      return;    }

    fetchingNow.current = true;

    try {
      dispatch({ type: SET_LOADING });

      const decimals = await fetchDecimals();
      fetchingNow.current = false;
      dispatch({ type: SET_DECIMALS_CONTEXT, payload: decimals });
    } catch (e) {
      console.log(e);
      fetchingNow.current = false;
      dispatch({ type: SET_FAILED });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DecimalContext.Provider value={{ ...state, getDecimals}}>
      {children}
    </DecimalContext.Provider>
  );
};

export default DecimalContext;
export { useDecimalContext };
