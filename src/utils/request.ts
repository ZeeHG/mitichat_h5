import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getChatUrl } from "./storage";

const serves = axios.create({
  baseURL: getChatUrl(),
  timeout: 5000,
});

serves.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers.operationID = uuidv4();
    return config;
  },
  (err) => Promise.reject(err)
);

serves.interceptors.response.use(
  (res) => {
    if (res.data.errCode !== 0) {
      return Promise.reject(res.data);
    }
    return res.data;
  },
  (err) => {
    if (err.message.includes("timeout")) {
      console.log("timeout", err);
    }
    if (err.message.includes("Network Error")) {
      console.log("Network Error", err);
    }
    return Promise.reject(err);
  }
);

export default serves;
