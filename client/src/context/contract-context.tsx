import React, { PropsWithChildren, useCallback, useContext } from "react";
import Web3 from 'web3';
import { ApiRequestStatus } from "../constants/api-request-status";
import DecimalsContract from "../contracts/Decimals.json";
import getWeb3 from "../utils/getWeb3";
import { ContractActions,
  ContractState,
  DecimalsContracts,
  reducer,
  SET_CONTEXT,
  SET_FAILED,
  SET_LOADING } from "./contract-reducer";
export interface ContractContextState extends ContractState {
  getContract: () => Promise<DecimalsContracts>
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
  getContract: (): Promise<DecimalsContracts> => {
    return Promise.resolve({});
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

      const deployedNetwork = DecimalsContract.networks[1631351044667];
      const abi: any = DecimalsContract.abi;
      const contracts:DecimalsContracts = {
        DecimalsContract: new web3.eth.Contract(
            abi,
            deployedNetwork && deployedNetwork.address
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const fetchContract = useCallback(async () => {
    console.log("const DecimalsContract", state.contracts.DecimalsContract)
    if(state.contracts.DecimalsContract) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getContract = useCallback(async () => {
    return state.contracts;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return (
    <ContractContext.Provider value={{ ...state, getContract, fetchContract, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;
export { useContractContext };
