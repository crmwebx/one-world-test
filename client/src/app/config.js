let config = {
  // prod
  // HOST_NAME: "https://admin-myeslsca.azurewebsites.net",
  // API_BASE_URL: "https://admin-myeslsca.azurewebsites.net/api/",

  // for prod
  // SHAREQUESTPHRASE: "Sanjeev14",
  // SHARESPONSEPHRASE: "Sanjeev14",
  // ACCESSCODE: "aukicm0VNaCvqdPJByLF",
  // MERCHANTIDENTIFIER: "XpKsqQix",
  // PURCHASEHOSTURL: "https://checkout.payfort.com/FortAPI/paymentPage",
  // return_url:
  //   "https://admin-myeslsca.azurewebsites.net/api/payment/purchase/response",

  //local

  // HOST_NAME: "http://localhost:3001",
  // API_BASE_URL: "http://localhost:3001/api/",

  //dev

  HOST_NAME: "https://oneworldwebappcontainer.azurewebsites.net",
  API_BASE_URL: "https://oneworldwebappcontainer.azurewebsites.net/api/",

  INVALID_PASSWORD: "Invalid Username or Password",
  CONFIRM_PASSWORD: "Password and confirm Passowrd didn't matched",

  // for dev
  SHAREQUESTPHRASE: "TESTSHAIN",
  SHARESPONSEPHRASE: "TESTSHAOUT",
  ACCESSCODE: "BVAqsy3vJF3OoTNMQMjU",
  MERCHANTIDENTIFIER: "ouWmOQdP",
  PURCHASEHOSTURL: "https://sbcheckout.payfort.com/FortAPI/paymentPage",
  //return_url: "http://localhost:3001/api/payment/purchase/response",
  return_url:
    "https://oneworldwebappcontainer.azurewebsites.net/api/payment/purchase/response",
};

export default config;
