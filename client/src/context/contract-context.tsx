import React, { PropsWithChildren, useCallback, useContext } from "react";
import Web3 from 'web3';
import { ApiRequestStatus } from "../constants/api-request-status";
import CyberPunkRangersTokenContract from "../contracts/CyberPunkRangersToken.json";
import CyberPunkRangersContract from "../contracts/CyberPunkRangers.json";
import getWeb3 from "../utils/getWeb3";
import { ContractActions, ContractState, CyberPunkContracts, reducer, SET_CONTEXT, SET_CONTRACTS, SET_FAILED, SET_LOADING } from "./contract-reducer";
export interface ContractContextState extends ContractState {
  getContract: () => Promise<CyberPunkContracts>
  fetchContract: () => void
  dispatch: (action: ContractActions) => void
};

const initialState: ContractContextState = {
  contracts: {},
  status: ApiRequestStatus.none,
  isWeb3: false,
  web3Provider: null,
  web3: null,
  account: null,
  getContract: (): Promise<CyberPunkContracts> => {
    return new Promise<CyberPunkContracts>((resolve) => {
      resolve({});
    });
  },
  fetchContract: (): void => {},
  dispatch: (): void => {}
};

initialState.web3 = new Web3(initialState.web3Provider)

const ContractContext = React.createContext(initialState);

const useContractContext = (): ContractContextState => useContext(ContractContext);

export const ContractContextProvider = ({ children }: PropsWithChildren<unknown>):React.ReactElement => {
  const [ state, dispatch ] = React.useReducer(reducer, initialState);

  const fetchingNow = React.useRef(false);

  const fetchContractFunction = useCallback(async () => {
    try{
      console.log("fetchContractFunction");
      const web3 = await getWeb3();
      dispatch({ type: SET_CONTEXT, payload: { web3 } });
      console.log("fetchContractFunction1");
      const web3Provider = web3.currentProvider;
      const accounts = await web3.eth.getAccounts();
      console.log("fetchContractFunction2");
      const account = accounts[0];
      console.log(accounts[0]);

      const deployedNetwork = CyberPunkRangersTokenContract.networks[5777];
      const abi: any = CyberPunkRangersTokenContract.abi;
      const deployedNetwork2 = CyberPunkRangersContract.networks[5777];
      const abi2: any = CyberPunkRangersContract.abi;
      const contracts:CyberPunkContracts = {
        CyberPunkRangersTokenContract: new web3.eth.Contract(
          abi,
          deployedNetwork && deployedNetwork.address
          ),
        CyberPunkRangersContract: new web3.eth.Contract(
            abi2,
            deployedNetwork2 && deployedNetwork2.address
          )
      }

      return({
        status: ApiRequestStatus.isSuccessful,
        isWeb3:true,
        account,
        web3Provider,
        web3,
        contracts
      })
    } catch(e) {
      console.log("error", e);
      return({...state, status: ApiRequestStatus.isFailed})
    }
  },[]);

  const fetchContract = useCallback(async () => {
    console.log("const CyberPunkRangersContract", state.contracts.CyberPunkRangersContract)
    console.log("const CyberPunkRangersTokenContract", state.contracts.CyberPunkRangersTokenContract)
    if(state.contracts.CyberPunkRangersContract && state.contracts.CyberPunkRangersTokenContract) {
      return;
    }

    if (fetchingNow.current) {
      return;
    }
    console.log("fetchingNow", fetchingNow)


    fetchingNow.current = true;
    console.log("fetchingNow", fetchingNow)
    try {
      dispatch({ type: SET_LOADING });

      const fetchedContracts = await fetchContractFunction();
      console.log("fetchedContracts", fetchedContracts)
      fetchingNow.current = false;
      dispatch({ type: SET_CONTEXT, payload: fetchedContracts });
    } catch (e) {
      console.log("error", e)
      fetchingNow.current = false;
      dispatch({ type: SET_FAILED });
    }
  },[]);

  const getContract = useCallback(async () => {
    return state.contracts;
  },[]);
  return (
    <ContractContext.Provider value={{ ...state, getContract, fetchContract, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;
export { useContractContext };
