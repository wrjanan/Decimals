import { Contract } from "web3-eth-contract";

class ContractTokenService {
  public async getAccumulatedTokens(contract: Contract,index: number): Promise<number>  {
    return contract?.methods.accumulated(index).call();
  }

  public async claimTokens(contract: Contract, account: string, tokenIndexes: number[]): Promise<number>  {
    return contract?.methods.claim(tokenIndexes).send({from:account});
  }

  public async getTotalTokens(contract: Contract, account: string): Promise<number>  {
    return contract?.methods.balanceOf(account).call();
  }
}

export default new ContractTokenService();
