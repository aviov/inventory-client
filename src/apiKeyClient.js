import { Auth } from 'aws-amplify';
import { createAuthLink } from 'aws-appsync-auth-link';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import config from './config';
import './index.css';

const apiKey = config.appSyncConfig.aws_appsync_apiKey;
const url = config.appSyncConfig.aws_appsync_graphqlEndpoint;
const region = config.appSyncConfig.aws_appsync_region;
const auth = {
  type: 'API_KEY',
  apiKey, 
  credentials: () => Auth.currentCredentials(),
  jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
  complexObjectsCredentials: () => Auth.currentCredentials()
};

const awsLink = createAuthLink({ url, region, auth })

const link = ApolloLink.from([
   awsLink,
   createHttpLink({ uri: url })
]);
const apiKeyClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default apiKeyClient;
