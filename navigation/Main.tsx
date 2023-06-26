import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotesList from "../components/notesList";
import NoteEditor from "../components/noteEditor";
import { NavigationContainer } from "@react-navigation/native";
import { Button, Surface, Text } from "react-native-paper";
import { FontAwesome } from 'react-native-vector-icons';
import { TouchableOpacity } from "react-native";

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
        screenOptions={({ navigation, route }) => ({
          title: route.name,
          headerShown: true,
        })}
        initialRouteName="MainTabs"
      >
        <MainStack.Screen 
          name="MainTabs" component={NotesList} 
        />
        <MainStack.Screen 
          name="NoteEditor" component={NoteEditor} 
        />
    </MainStack.Navigator>
  );
};

export default Main;