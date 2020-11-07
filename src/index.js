import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createAuthLink } from 'aws-appsync-auth-link';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, ApolloProvider } from '@apollo/client';
import AppSyncConfig from './aws-exports';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const url = AppSyncConfig.aws_appsync_graphqlEndpoint;
const region = AppSyncConfig.aws_appsync_region;
const auth = {
  type: AppSyncConfig.aws_appsync_authenticationType,
  apiKey: AppSyncConfig.aws_appsync_apiKey
};
const link = ApolloLink.from([
   createAuthLink({ url, region, auth }), 
   createHttpLink({ uri: url })
]);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
