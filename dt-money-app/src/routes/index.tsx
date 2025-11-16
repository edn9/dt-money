import { NavigationContainer } from "@react-navigation/native";
import { PublicRoutes } from "./PublicRoutes";
import { useCallback, useState } from "react";
import { PrivateRoutes } from "./PrivateRoutes";
import { StatusBar } from "expo-status-bar";
import { useAuthContext } from "@/context/auth.context";
import { Loading } from "@/screens/Loading";

const NavigationRoutes = () => {
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthContext();

  const Routes = useCallback(() => {
    if (loading) {
      return <Loading setLoading={setLoading} />;
    }
    if (!user || !token) {
      return <PublicRoutes></PublicRoutes>;
    } else {
      return <PrivateRoutes></PrivateRoutes>;
    }
  }, [user, token, loading]);

  return (
    <NavigationContainer>
      <StatusBar style={"light"}></StatusBar>
      <Routes />
    </NavigationContainer>
  );
};

export default NavigationRoutes;
