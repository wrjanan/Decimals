import React, { useState } from 'react';
import { ApiRequestStatus } from '../../constants/api-request-status';
import { useWeb3Context } from '../../context/web3-context';

const GalleryView: React.VFC = () => {
  const { status, isWeb3, account } = useWeb3Context();
  const [value, setValue] = useState('');

  const printDetails = () => {
    setValue("printed");
    if(status === ApiRequestStatus.isLoading) {
      return (<div>Loading Web3, accounts, and contract...</div>);
    }

    if(isWeb3) {
      return (
      <>
        <h1>Good to Go! {account}</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of "hello World" (by default).
        </p>
        <p>
          Try changing the value stored on <strong> </strong> of Gallery.ts.
        </p>
        <div>The stored value is: {value}</div>

        <p>Click here to run the ACcount : {account} </p>
        <button onClick={() => console.log()}>click</button>
      </>
      )
    } else {
      <div>
        <p>none web3</p>
      </div>
    }
  };

  return (
    <div className="GalleryView">
      { printDetails() }
    </div>
  );
}

export default GalleryView;
