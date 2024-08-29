import axios, { AxiosInstance } from 'axios';
import { HostContext } from '../types';

export default axios.create({
  baseURL: `https://orders-qa.matrixcare.me`
});


let instance: AxiosInstance;

const apiClient = (): AxiosInstance => {
  // If the instance has already been instantiated then return it. Otherwise create a new instance.
  if (instance !== undefined)
    return instance;

  // Get the host context from redux
  const hostContext = (window as any).ordersMfeHostContext as HostContext;

  instance = axios.create({
    baseURL: "/cloud-service/orders-pilot"
  });

  // Add context values as headers
  if (hostContext && instance.defaults) {
    instance.defaults.headers.common["User-Id"] = hostContext.userId;
    instance.defaults.headers.common["Ect-Config-Id"] = hostContext.ectConfigId;
  }

  return instance;
}

export { apiClient };