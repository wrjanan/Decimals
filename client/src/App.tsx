import React, { useEffect } from 'react';
import './css/App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { RouteContainer } from './views/routes/RouteContainer';
import { ContractContextProvider, useContractContext } from './context/contract-context';
import { Layout } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import { useWeb3Context, Web3ContextProvider } from './context/web3-context';
import { ApiRequestStatus } from './constants/api-request-status';
import DecimalsContract from "./contracts/Decimals.json";

const App: React.VFC = () => {
  const { status, fetchWeb3 } = useWeb3Context();
  const { fetchContract } = useContractContext();

  const customHistory = createBrowserHistory();

  useEffect(() => {
    const initWeb3 = async () => {
      if(status === ApiRequestStatus.none) {
        await fetchWeb3();
        await fetchContract();
      }
    }
    initWeb3();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Web3ContextProvider>
      <ContractContextProvider>
        <Router history={customHistory}>
          <Layout>
            <Content style={{ margin: '48px 32px 0', overflow: 'initial' }}>
              <RouteContainer></RouteContainer>
            </Content>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>
            Decimals Contract: <a href={`https://etherscan.io/address/${DecimalsContract.networks[1631351044667].address}`}>{DecimalsContract.networks[1631351044667].address}</a>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            Decimals ©{new Date().getFullYear()}
            </Footer>
        </Router>
      </ContractContextProvider>
    </Web3ContextProvider>
  );
};

export default App;
