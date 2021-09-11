
import { Contract } from "web3-eth-contract";

type ContractInput = Contract | undefined;
type AccountInput = string | null;
class ContractService {
  public async getDecimalsURI(contract: ContractInput, index: number): Promise<string> {
    return contract?.methods.tokenURI(index).call();
  }

  public async mintDecimals(contract: ContractInput,nftCount: number, account: AccountInput): Promise<void>  {
    return contract?.methods.mint(nftCount).send({ from: account }).then((response: any) => {
      console.log("successful transaction", response);
    });
  }
}

export default new ContractService();
