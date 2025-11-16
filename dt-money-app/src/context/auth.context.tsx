import { FormLoginParams } from "@/screens/Login/LoginForm";
import { FormRegisterParams } from "@/screens/Register/RegisterForm";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useCallback
} from "react";
import * as authService from "@/shared/services/dt-money/auth.service";
import { IUser } from "@/shared/interfaces/user-interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthenticateResponse } from "@/shared/interfaces/https/authenticate-response";

type AuthContextType = {
  user: IUser | null;
  token: string | null;
  handleAuthenticate: (params: FormLoginParams) => Promise<void>;
  handleRegister: (params: FormRegisterParams) => Promise<void>;
  handleLogout: () => Promise<void>;
  restoreUserSession: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleAuthenticate = useCallback(async (userData: FormLoginParams) => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("dt-money-user");
    
    const { token, user } = await authService.authenticate(userData);
    await AsyncStorage.setItem(
      "dt-money-user",
      JSON.stringify({ user, token })
    );

    setUser(user);
    setToken(token);
  }, []);

  const handleRegister = useCallback(async (formData: FormRegisterParams) => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("dt-money-user");
    
    const { token, user } = await authService.registerUser(formData);
    await AsyncStorage.setItem(
      "dt-money-user",
      JSON.stringify({ user, token })
    );

    setUser(user);
    setToken(token);
  }, []);

  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem("dt-money-user");
    setToken(null);
    setUser(null);
  }, []);

  const restoreUserSession = useCallback(async () => {
    const userData = await AsyncStorage.getItem("dt-money-user");
    if (userData) {
      const { token, user } = JSON.parse(userData) as IAuthenticateResponse;
      setUser(user);
      setToken(token);
    }
    return userData;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      handleAuthenticate,
      handleRegister,
      handleLogout,
      restoreUserSession,
    }),
    [
      user,
      token,
      handleAuthenticate,
      handleRegister,
      handleLogout,
      restoreUserSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
