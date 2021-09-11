import React from 'react';
import { Menu } from 'antd';
import Layout, { Header } from 'antd/lib/layout/layout';
import { MobileView, BrowserView } from 'react-device-detect';
import {
  HomeOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import SubMenu from 'antd/lib/menu/SubMenu';
import "./MainHeader.css"

function MainHeader() {
  const history = useHistory();

  const goTo = async (link: string) => {
    history.push(link);
  }

  return (
    <Layout>
      <Header style={{ justifyContent: "center", alignItems: "center", display: "flex"}}>
        <MobileView>
          <Menu theme="dark" mode="horizontal">
            <SubMenu
              // popupClassName="MobilePopupMenu"
              key="sub1"
              icon={<HomeOutlined/>}
              title="Decimals"
              style={{justifyContent:"center"}}>
              <Menu.Item key="/" title="Home" onClick={() => goTo("/")}>Home</Menu.Item>
              <Menu.Item key="/contracts" onClick={() => goTo("/contracts")}>Contracts</Menu.Item>
              <Menu.Item key="/gallery" onClick={() => goTo("/gallery")}>Gallery</Menu.Item>
            </SubMenu>
          </Menu>
        </MobileView>
        <BrowserView>
          <Menu mode="horizontal" theme="dark" defaultSelectedKeys={["/"]}>
            <Menu.Item key="/" title="Home" onClick={() => goTo("/")}>Home</Menu.Item>
            {/* <Menu.Item key="/contracts" onClick={() => goTo("/contracts")}>Contracts</Menu.Item>
            <Menu.Item key="/gallery" onClick={() => goTo("/gallery")}>Gallery</Menu.Item> */}
          </Menu>
        </BrowserView>
      </Header>
    </Layout>
  );
}

export default MainHeader;
