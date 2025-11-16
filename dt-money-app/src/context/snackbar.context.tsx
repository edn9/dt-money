import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

export type SnackbarMessageType = "ERROR" | "SUCCESS";

interface NotifyMessageParams {
  message: string;
  messageType: SnackbarMessageType;
}

export type SnackbarContextType = {
  message: string | null;
  type: SnackbarMessageType | null;
  notify: (params: NotifyMessageParams) => void;
};

const SnackbarContext = createContext({} as SnackbarContextType);

export const SnackbarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<SnackbarMessageType | null>(null);

  const notify = ({ message, messageType }: NotifyMessageParams) => {
    setMessage(message);
    setType(messageType);
    setTimeout(() => {
      setMessage(null);
      setType(null);
    }, 3000);
  };

  const value = useMemo(
    () => ({
      message,
      type,
      notify,
    }),
    [message, type, notify]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  return context;
};
