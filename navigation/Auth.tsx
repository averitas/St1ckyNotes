import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../components/login";
import LogoutPage from "../components/logout";
import ProfilePage from "../components/profile";
import { NavigationContainer } from "@react-navigation/native";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        initialRouteName="Login"
        >
        <AuthStack.Screen name="Login" component={LoginPage} />
        <AuthStack.Screen name="Logout" component={LogoutPage} />
        <AuthStack.Screen name="Profile" component={ProfilePage} />
    </AuthStack.Navigator>
    
  );
};

export default Auth;
