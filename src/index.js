import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import amplifyconfiguration from './amplifyconfiguration.json';
import { fetchAuthSession } from 'aws-amplify/auth';
import { createAuthLink } from 'aws-appsync-auth-link';
import { setContext } from 'apollo-link-context';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, ApolloProvider } from '@apollo/client';
import config from './config';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

Amplify.configure(amplifyconfiguration);
// Amplify.configure({
//   Auth: {
//     Cognito: {
//       region: config.cognito.REGION,
//       userPoolId: config.cognito.USER_POOL_ID,
//       userPoolWebClientId: config.cognito.APP_CLIENT_ID,
//       identityPoolId: config.cognito.IDENTITY_POOL_ID,
//       mandatorySignIn: true,
//       loginWith: {
//         username: 'true',
//         email: 'true'
//       }
//     },
//   },
//   Storage: {
//     region: config.storage.REGION,
//     bucket: config.storage.BUCKET,
//     identityPoolId: config.cognito.IDENTITY_POOL_ID
//   }
// });

const url = config.appSyncConfig.aws_appsync_graphqlEndpoint;
const region = config.appSyncConfig.aws_appsync_region;
const auth = {
  type: config.appSyncConfig.aws_appsync_authenticationType,
  credentials: async () => (await fetchAuthSession()).credentials,
  jwtToken: async () => (await fetchAuthSession()).credentials.sessionToken,
  complexObjectsCredentials: async () => (await fetchAuthSession()).credentials
};

// const currentSession = await fetchAuthSession();
// console.log('currentSession', currentSession);
// const currentUser = await getCurrentUser();
// console.log('currentUser', currentUser);
// const currentSessionPayload = currentSession.payload;
// console.log('currentSessionPayload', currentSessionPayload);
// console.log('auth', auth)

const awsLink = createAuthLink({ url, region, auth })

const link = ApolloLink.from([
  setContext(async (request, prevContext) => ({
    headers: {
      ...prevContext.headers,
      tenant: ((await fetchAuthSession()).tokens.idToken.payload['cognito:groups'] || [])[0]
    }
  })),
  awsLink,
  createHttpLink({ uri: url })
]);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <ApolloProvider client={client}>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </ApolloProvider>
  </Router>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
