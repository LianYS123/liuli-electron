import axios, { AxiosRequestConfig } from "axios";
import qs from "query-string";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9988",
  method: "POST",
  paramsSerializer(params) {
    return qs.stringify(params);
  }
});

export const xFetch = async (url: string, config?: AxiosRequestConfig) => {
  const { data } = await axiosInstance(url, config);
  return data;
};
