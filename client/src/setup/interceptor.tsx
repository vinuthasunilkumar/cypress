import axios from "axios";
import join from "url-join";
import { environmemnt } from "./environment.qa";

axios.interceptors.request.use(
  (config) => {
    if (config?.url?.includes("api")) {
      config.url = join(environmemnt.baseUrl, config.url);
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
