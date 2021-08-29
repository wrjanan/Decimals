import React, { PropsWithChildren, useCallback, useContext, useEffect } from "react";
import { ApiRequestStatus } from "../constants/api-request-status";
import getWeb3 from "../utils/getWeb3";
import { reducer, SET_FAILED, SET_LOADING, SET_WEB3_CONTEXT, Web3State } from "./web3-reducer";

export interface Web3ContextState extends Web3State {
  fetchWeb3: () => void
};

const initialState: Web3ContextState = {
  status: ApiRequestStatus.none,
  isWeb3: false,
  web3Provider: null,
  web3: null,
  accounts: null,
  account: null,
  fetchWeb3: (): void => {},
};

const Web3Context = React.createContext(initialState);

const useWeb3Context = (): Web3ContextState => useContext(Web3Context);

export const Web3ContextProvider = ({ children }: PropsWithChildren<unknown>):React.ReactElement => {
  const [ state, dispatch ] = React.useReducer(reducer, initialState);

  const fetchingNow = React.useRef(false);

  const fetchWeb3Function = useCallback(async () => {
    try{
      console.log("fetchContractFunction");
      const web3 = await getWeb3();
      console.log("fetchContractFunction1");
      const web3Provider = web3.currentProvider;
      const accounts = await web3.eth.getAccounts();
      console.log("fetchContractFunction2");
      const account = accounts[0];
      console.log(accounts[0]);
      const payload = {
        status: ApiRequestStatus.isSuccessful,
        isWeb3:true,
        account,
        accounts,
        web3Provider,
        web3,
      }

      dispatch({ type: SET_WEB3_CONTEXT, payload })
      return(payload)
    } catch(e) {
      console.log("error", e);
      return({...state, status: ApiRequestStatus.isFailed})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const fetchWeb3 = useCallback(async () => {

    if (fetchingNow.current) {
      return;
    }
    console.log("fetchingNow", fetchingNow)


    fetchingNow.current = true;
    console.log("fetchingNow", fetchingNow)
    try {
      dispatch({ type: SET_LOADING });
      const fetchedWeb3 = await fetchWeb3Function();
      console.log("fetchedWeb3s", fetchedWeb3)
      fetchingNow.current = false;
      dispatch({ type: SET_WEB3_CONTEXT, payload: fetchedWeb3 });
    } catch (e) {
      console.log("error", e)
      fetchingNow.current = false;
      dispatch({ type: SET_FAILED });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    fetchWeb3();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Web3Context.Provider value={{...state, fetchWeb3}}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
export { useWeb3Context };
