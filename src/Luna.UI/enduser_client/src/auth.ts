import { Configuration, PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import {AdalConfig, adalGetToken, AuthenticationContext} from 'react-adal';
export const getMsalConfig = () => {
  // Use runtime environment variables if found in env-config.js, otherwise fallback to
  // env settings defined in build time.
  // Note: env-config.js is generated on the flying during contain app starts.
 
  const appId = window.Configs.AAD_APPID as string;
  const tenantId = window.Configs.AAD_TENANT_ID as string;
  // const tenantId =
  //   window.environment?.azureTenantId ?? process.env.REACT_APP_AZURE_TENANT_ID;
  // const authority = `https://login.microsoftonline.com/${tenantId}`;
  const authority = `https://login.microsoftonline.com/common`;

  const msalConfig: Configuration = {
    auth: {
      clientId: appId,
      authority: authority,
      redirectUri: window.location.origin,
    },
  };
  console.log("clientId = ", appId);
  console.log("authority = ", authority);

  return new PublicClientApplication(msalConfig);
};


export const getIdToken = async (
  msalInstance: PublicClientApplication
): Promise<string> => {
  const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const accounts = msalInstance.getAllAccounts();
  const request = {
    scopes: ["User.Read"],
    account: activeAccount || accounts[0],
  };

  let idToken = "";

  // Silently acquire an token for a given set of scopes. Will use cached token if available, otherwise will attempt to acquire a new token from the network via refresh token.
  // A known issue may cause token expire: https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/4206
  await msalInstance
    .acquireTokenSilent(request)
    .then((response) => {
      idToken = response.idToken;
    })
    .catch((error) => {
      // acquireTokenSilent can fail for a number of reasons, fallback to interaction
      if (error instanceof InteractionRequiredAuthError) {
        msalInstance.acquireTokenPopup(request).then((response) => {
          idToken = response.idToken;
        });
      }
    });

  return idToken;
};




