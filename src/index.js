import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Amplify, Auth } from 'aws-amplify';
import { createAuthLink } from 'aws-appsync-auth-link';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, ApolloProvider } from '@apollo/client';
import config from './config';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
});

const url = config.appSyncConfig.aws_appsync_graphqlEndpoint;
const region = config.appSyncConfig.aws_appsync_region;
const auth = {
  type: config.appSyncConfig.aws_appsync_authenticationType,
  credentials: () => Auth.currentCredentials(),
  jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
  complexObjectsCredentials: () => Auth.currentCredentials()
};

const awsLink = createAuthLink({ url, region, auth })

const link = ApolloLink.from([
   awsLink,
   createHttpLink({ uri: url })
]);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
