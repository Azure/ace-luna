import React from 'react';
import './App.css';
import {Route, Switch} from 'react-router-dom';
import {WebRoute} from "./shared/constants/routes";
import {AuthRoute} from './shared/components/AuthRoute';
import * as Routes from './routes';
import {NotFound} from "./shared/components/NotFound";
import Layout from "./layout/Layout";
import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";

import {initializeIcons} from 'office-ui-fabric-react/lib/Icons';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getMsalConfig } from "./auth";

initializeIcons(/* optional base url */);

toast.configure({autoClose: 2000});
const msalClient = getMsalConfig();

const App: React.FC = () => {

  const BaseRoutes = () => {

    return (
      <MsalProvider instance={msalClient}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
    <Layout>
      <Switch>
        {/* Protected Routes */}
        <AuthRoute exact={true} path={WebRoute.Home} component={Routes.Home}/>        
        <AuthRoute path={WebRoute.Subscriptions} component={Routes.Subscriptions} />
        <AuthRoute path={WebRoute.LandingPage} component={Routes.LandingPage} />
        <AuthRoute path={WebRoute.OperationHistory} component={Routes.OperationHistory} />
        <Route component={NotFound}/>
      </Switch>
    </Layout>
    </MsalAuthenticationTemplate>
    </MsalProvider>
    );
  };

  return (
    <div className="App">
      <Switch>
        <Route render={() => <BaseRoutes/>}/>
      </Switch>
    </div>
  );
}

export default App;
