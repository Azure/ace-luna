import React from 'react';
import {Image, Link, Stack, Text, getTheme} from 'office-ui-fabric-react';
import {useHistory} from "react-router";
import {WebRoute} from "../shared/constants/routes";
import {getMsalConfig} from "../auth";


const Header: React.FunctionComponent = () => {

  const msalClient = getMsalConfig();
  const logo = "../../logo.png";
  const isvName = window.Configs.ISV_NAME;
  const headerBackgroundColor = window.Configs.HEADER_BACKGROUND_COLOR;
  let userName = "";

  const theme = getTheme();
  const history = useHistory();

  var accounts = msalClient.getAllAccounts()
  var account = accounts[0]
  if (account && account.username)
    userName = account.username;

  const handleLogOut = () => {
    msalClient.logoutRedirect();
  };

  return (
    <Stack
      horizontal={true}
      verticalAlign={"center"}
      styles={{
        root: {
          backgroundColor: `${headerBackgroundColor}`,
          height:57
        }
      }}
    >
      <Stack
        horizontal={true}
        horizontalAlign={"center"}
        verticalAlign={"center"}
        styles={{
          root: {
            marginLeft:27,
            marginRight:'1%'
          }
        }}
      >
        <Image src={logo} onClick={() => {history.push(WebRoute.Subscriptions)}} style={{cursor: 'pointer',height: '57px' }} />
      </Stack>
      <div className={'header-logo-separator'}></div>
      <span className={'isv_title'} style={{textAlign:"left",marginLeft:27,flexGrow:1}}>
        {isvName}
      </span>
      <div>
        <span className={'isv_title'} style={{fontSize:14}}>
          Welcome, {userName}
        </span>
        <span className={'isv_title'} style={{fontSize:14, margin:5}}>
          |
        </span>
        <Link onClick={handleLogOut} className={'isv_title'} style={{marginRight: 27, fontSize:14, color:'white'}}>
          Log Out
        </Link>
      </div>

    </Stack>
  );
};

export default Header;