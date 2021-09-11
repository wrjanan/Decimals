import { ApiRequestStatus } from "../constants/api-request-status";
import { Contract } from "web3-eth-contract";
import _ from "lodash";

export interface DecimalsContractState {
  DecimalsContract: Contract | null,
  decimals: any[] | null;
  status: ApiRequestStatus;
}

export const initialDecimalsContractState: DecimalsContractState = {
  DecimalsContract: null,
  decimals: null,
  status: ApiRequestStatus.none
};

export const SET_DECIMALS_CONTEXT = "SET_DECIMALS_CONTEXT";
export const SET_LOADING = "SET_LOADING";
export const SET_FAILED = "SET_FAILED";

export interface AppActions {
  type: string;
  payload?: Partial<DecimalsContractState>;
}

export const reducer = (state: DecimalsContractState, action: AppActions): DecimalsContractState => {
  console.log("reducer", state, action);
  switch (action.type) {
    case SET_LOADING:
      return { ...state, status: ApiRequestStatus.isLoading };
    case SET_FAILED:
      return { ...state, status: ApiRequestStatus.isFailed };
    case SET_DECIMALS_CONTEXT:
      return { ...state, status: ApiRequestStatus.isSuccessful, ..._.pickBy(action.payload, _.identity)};
    default:
      return state;
  }
};
