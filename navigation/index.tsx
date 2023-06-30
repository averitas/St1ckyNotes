import React, { useContext } from "react";

import { View, StyleSheet } from 'react-native';
import Main from "./Main";
import Auth from "./Auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions, NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default () => {
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
                type: 'tabPress',
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
        initialRouteName="Notes"
      >
        <Tab.Screen
            name="Notes"
            component={Main}
            options={{
            tabBarLabel: 'Notes',
            tabBarIcon: ({ color, size }) => {
                return <Icon name="book-open-outline" size={size} color={color} />;
            },
            }}
        />
        <Tab.Screen
            name="Config"
            component={Auth}
            options={{
            tabBarLabel: 'Configuration',
            tabBarIcon: ({ color, size }) => {
                return <Icon name="cog" size={size} color={color} />;
            },
            }}
        />
      </Tab.Navigator>
      </NavigationContainer>
    );
  };
