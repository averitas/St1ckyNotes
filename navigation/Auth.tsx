import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../components/login";
import LogoutPage from "../components/logout";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginPage} />
      <AuthStack.Screen name="Logout" component={LogoutPage} />
    </AuthStack.Navigator>
  );
};

export default Auth;
