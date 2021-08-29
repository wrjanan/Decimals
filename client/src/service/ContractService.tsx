
import { Contract } from "web3-eth-contract";

type ContractInput = Contract | undefined;
type AccountInput = string | null;
class ContractService {
  public async setBaseURL(contract: ContractInput, account: AccountInput, url: string): Promise<string> {
    return contract?.methods.setBaseURI(url).send({from:account});
  }

  public async getPunkURI(contract: ContractInput, index: number): Promise<string> {
    return contract?.methods.tokenURI(index).call();
  }
  public async getPunkName(contract: ContractInput,index: number): Promise<string> {
    return contract?.methods.tokenNameByIndex(index).call();
  }
  public async getPunkDescription(contract: ContractInput,index: number): Promise<string>  {
    return contract?.methods.tokenDescriptionByIndex(index).call();
  }

  public async getPunkAddress(contract: ContractInput, account: AccountInput, index: number): Promise<string>  {
    return contract?.methods.tokenOfOwnerByIndex(account, index).call();
  }

  public async getStartingIndex(contract: ContractInput): Promise<number>  {
    return contract?.methods.startingIndex().call();
  }

  public async getAccumulatedTokens(contractTokens: Contract,index: number): Promise<number>  {
    return contractTokens?.methods.accumulated(index).call();
  }

  public async claimTokens(contractTokens: Contract, account: AccountInput, tokenIndexes: number[]): Promise<number>  {
    return contractTokens?.methods.claim(tokenIndexes).send({from:account});
  }

  public async getTotalTokens(contractTokens: Contract, account: AccountInput): Promise<number>  {
    return contractTokens?.methods.balanceOf(account).call();
  }
}

export default new ContractService();
