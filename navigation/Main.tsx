import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotesList from "../components/notesList";
import NoteEditor from "../components/noteEditor";

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={NotesList} />
      <MainStack.Screen name="NoteEditor" component={NoteEditor} />
    </MainStack.Navigator>
  );
};

export default Main;