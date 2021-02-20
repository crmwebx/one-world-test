import axios from "axios";

import config from "app/config";

let axiosObject;

axiosObject = axios.create({
  baseURL: config.API_BASE_URL,
});
// axiosObject.interceptors.request.use(request => {
//   console.log("request",request);
//   // Edit request config
//   return request;
// }, error => {
//   console.log("error occured",error);
//   return Promise.reject(error);
// });

// axiosObject.interceptors.response.use(response => {
//   console.log("response",response);
//   // Edit request config
//   return response;
// }, error => {
//   console.log("error",error.response.message);
//   return Promise.reject(error);
// });

export default axiosObject;
