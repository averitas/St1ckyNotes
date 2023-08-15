import React, { useContext } from "react";

import { View, StyleSheet } from "react-native";
import Main from "./Main";
import Auth from "./Auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { ConnectedProps, connect } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { initAsync, GetAvatarAsync } from "../redux/actions";

const mapState = (state: RootState) => ({
  AuthResult: state.authReducer.AuthResult,
});

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    initAsync: () => dispatch(initAsync()),
    getAvatarAsync: () => dispatch(GetAvatarAsync()),
  };
};

// init redux property
const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface AppProps extends PropsFromRedux {
  navigation: any;
  route: any;
}
const Tab = createBottomTabNavigator();

const App = (props: AppProps) => {
  const [avatar, setAvatar] = React.useState("");

  React.useEffect(() => {
    props.initAsync();
  }, []);

  React.useEffect(() => {
    props.getAvatarAsync().then((avatarUrl) => {
      if (avatarUrl.payload != null) {
        setAvatar(avatarUrl.payload as string);
      }
    });
  }, [props.AuthResult]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 24 });
              }

              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? String(options.tabBarLabel)
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              return label;
            }}
          />
        )}
        initialRouteName="MainPage"
      >
        <Tab.Screen
          name="MainPage"
          component={Main}
          options={{
            tabBarLabel: "Notes",
            tabBarIcon: ({ color, size }) => {
              return (
                <Icon name="book-open-outline" size={size} color={color} />
              );
            },
          }}
        />
        <Tab.Screen
          name="Config"
          component={Auth}
          options={{
            tabBarLabel: "Configuration",
            tabBarIcon: ({ color, size }) => {
              if (avatar != "") {
                return (
                  <img
                    src={avatar}
                    width={size}
                    height={size}
                    style={{ borderRadius: "50%" }}
                  />
                );
              } else {
                return <Icon name="cog" size={size} color={color} />;
              }
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default connector(App);
