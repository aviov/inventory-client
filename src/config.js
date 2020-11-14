const dev = {
  cognito: {
    REGION: process.env.REACT_APP_COGNITO_REGION,
    USER_POOL_ID: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID
  },
  storage: {
    REGION: process.env.REACT_APP_S3_REGION,
    BUCKET: process.env.REACT_APP_S3_BUCKET,
  },
  appSyncConfig: {
    aws_appsync_graphqlEndpoint: process.env.REACT_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT,
    aws_appsync_region: process.env.REACT_APP_AWS_APPSYNC_REGION,
    aws_appsync_authenticationType: process.env.REACT_APP_AWS_APPSYNC_AUTHENTICATION_TYPE,
    aws_appsync_apiKey: process.env.REACT_APP_AWS_APPSYNC_API_KEY,
  }
};

// const prod = {
// };

const stageConfig = dev; // process.env.REACT_APP_STAGE === 'prod' ? prod : dev;
const config = {
  ...stageConfig
};
export default config;