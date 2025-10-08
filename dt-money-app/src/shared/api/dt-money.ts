import axios from "axios";
import { Platform } from "react-native";
import { AppError } from "../helpers/AppErrors";
import { addTokenToRequest } from "../helpers/axios.helper";

const baseURL = Platform.select({
  ios: "http://localhost:3001",
  android: "http://10.0.2.2:3001", //emulator
  //android: "http://192.168.0.21:3001", //IRL mobile wifi
});

export const dtMoneyApi = axios.create({
  baseURL,
});

addTokenToRequest(dtMoneyApi);

dtMoneyApi.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
    } else {
      return Promise.reject(new AppError("Falha na requisição"));
    }
  }
);
