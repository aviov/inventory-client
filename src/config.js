const dev = {
  // s3: {
  //   REGION: "",
  //   BUCKET: ""
  // },
  // apiGateway: {
  //   REGION: "",
  //   URL: ""
  // },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_xpHcGznuG",
    APP_CLIENT_ID: "66afcmmkrcccrjf9s633spuukh",
    IDENTITY_POOL_ID: "us-east-1:92baad61-438a-42ba-ae99-833097aa659f"
  },
  // STRIPE_KEY: '',
};

// const prod = {
//   s3: {
//     REGION: "",
//     BUCKET: ""
//   },
//   apiGateway: {
//     REGION: "",
//     URL: ""
//   },
//   cognito: {
//     REGION: "",
//     USER_POOL_ID: "",
//     APP_CLIENT_ID: "",
//     IDENTITY_POOL_ID: ""
//   },
//   STRIPE_KEY: '',
// };

const config = dev; // process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  // MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};