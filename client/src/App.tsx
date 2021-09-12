import React, { useEffect } from 'react';
import './css/App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { ContractContextProvider, useContractContext } from './context/contract-context';
import { Layout } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import { useWeb3Context, Web3ContextProvider } from './context/web3-context';
import { ApiRequestStatus } from './constants/api-request-status';
import Main from './views/MainApp';

const App: React.VFC = () => {
  const { status, fetchWeb3 } = useWeb3Context();
  const { fetchContract } = useContractContext();

  const customHistory = createBrowserHistory();

  const loadCanvas = () => {
    const c: HTMLCanvasElement = window.document.getElementById("background") as HTMLCanvasElement;
    const ctx = c.getContext("2d");

    //making the canvas full screen
    c.height = window.innerHeight;
    c.width = window.innerWidth;

    //chinese characters - taken from the unicode charset
    const char = "0123456789";
    const chars = char.split("");

    const font_size = 10;
    const columns = c.width/font_size; //number of columns for the rain
    //an array of drops - one per column
    const drops: any[] = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for(let x = 0; x < columns; x++)
      drops[x] = 1; 

    //drawing the characters
    function draw()
    {
      if(!ctx) {
        return;
      }
      //Black BG for the canvas
      //translucent BG to show trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, c.width, c.height);
      
      ctx.fillStyle = "#0F0"; //green text
      ctx.font = font_size + "px arial";
      //looping over drops
      for(var i = 0; i < drops.length; i++)
      {
        //a random chars character to print
        var text = chars[Math.floor(Math.random()*chars.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i*font_size, drops[i]*font_size);
        
        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*font_size > c.height && Math.random() > 0.975)
          drops[i] = 0;
        
        //incrementing Y coordinate
        drops[i]++;
      }
    }

    setInterval(draw, 33);
  }

  useEffect(() => {
    const initWeb3 = async () => {
      if(status === ApiRequestStatus.none) {
        await fetchWeb3();
        await fetchContract();
      }
    }
    initWeb3();
    loadCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Web3ContextProvider>
      <ContractContextProvider>
        <Router history={customHistory}>
          <Content style={{ margin: '48px 32px 0', justifyContent: "center", overflow: 'initial' }}>
            <Layout style={{ minHeight: "80vh", textAlign: 'center', justifyContent: "center", backgroundColor:"transparent" }}>
              <Main />
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Decimals Contract: <a className="hoverable" href={"https://etherscan.io/address/0xe106b70852e4Fd6Ea667823b9d79F499C5664CdF"}>0xe106b70852e4Fd6Ea667823b9d79F499C5664CdF</a>
            <br></br>
            <br></br>
            Decimals ©{new Date().getFullYear()}
          </Footer>
          <canvas id="background" style={{width:"100vw",height:"100vh",position: "fixed",top: "0", zIndex:-1}}></canvas>
        </Router>
      </ContractContextProvider>
    </Web3ContextProvider>
  );
};

export default App;
