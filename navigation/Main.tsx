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
        initialRouteName="Notes"
      >
        <MainStack.Screen
          name="Notes" component={NotesList} 
        />
        <MainStack.Screen
          options={({ navigation, route }) => ({
            headerShown: false,
          })}
          name="NoteEditor" component={NoteEditor} 
        />
    </MainStack.Navigator>
  );
};

export default Main;