import React from 'react';
import '../css/App.css';
import Layout from 'antd/lib/layout/layout';
import Intro from './main/1-intro';
import About from './main/5-about';
import Technicals from './main/6-technicals';
import { Divider } from 'antd';


function Main() {
  return (
    <>
      <Layout style={{ minHeight: "90vh", textAlign: 'center', justifyContent: "center" }}>
        <Intro />
      </Layout>
      <Divider></Divider>
      <Layout style={{ minHeight: "100vh", textAlign: 'center', justifyContent: "center", backgroundColor:"aquamarine", paddingTop:"1em", paddingBottom:"1em"}}>
        <About />
      </Layout>
      <Divider></Divider>
      <Layout style={{ minHeight: "100vh", textAlign: 'center', justifyContent: "center", backgroundColor:"darkturquoise", paddingTop:"1em", paddingBottom:"1em" }}>
        <Technicals />
      </Layout>
      <Divider></Divider>
    </>
  );
}

export default Main;
