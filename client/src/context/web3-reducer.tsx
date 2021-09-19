import { ApiRequestStatus } from "../constants/api-request-status";
import Web3 from 'web3';
import { provider } from "web3-core";

export interface Web3State {
  status: ApiRequestStatus;
  isWeb3: boolean;
  web3: Web3 | null;
  web3Provider: provider;
  accounts: string[] | null;
  account: string | null;
}

export interface Web3ContextState {
  status: ApiRequestStatus;
  isWeb3: boolean;
  web3Provider: provider | null;
  web3: Web3 | null;
  account: string | null;
}

export const initialState: Web3State = {
  status: ApiRequestStatus.none,
  isWeb3: false,
  web3Provider: null,
  web3: null,
  accounts: null,
  account: null,
};

export const SET_WEB3 = "SET_WEB3";
export const SET_LOADING = "SET_LOADING";
export const SET_FAILED = "SET_FAILED";
export const SET_WEB3_CONTEXT = "SET_WEB3_CONTEXT";

export interface Web3Actions {
  type: string;
  payload?: Partial<Web3State>;
}

export const reducer = (state: Web3State, action: Web3Actions): Web3State => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, status: ApiRequestStatus.isLoading };
    case SET_FAILED:
      return { ...state, status: ApiRequestStatus.isFailed };
    case SET_WEB3:
      return { ...state, ...action.payload, status: ApiRequestStatus.isSuccessful };
    case SET_WEB3_CONTEXT:
      return { ...state, ...action.payload, status: ApiRequestStatus.isSuccessful };
    default:
      return state;
  }
};
