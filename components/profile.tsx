import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Avatar,
  Surface,
  Card,
  PaperProvider,
  Button,
  Text,
  Divider,
  List,
  ActivityIndicator,
  MD2Colors,
} from "react-native-paper";
import { FontAwesome } from "react-native-vector-icons";
import { Note } from "../types/note";
import { v4 as uuidv4 } from "uuid";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ConnectedProps, connect } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setIosEphemeralSession } from "../redux/authSlice";
import {
  initAsync,
  loginAsync,
  logoutAsync,
  acquireTokenAsync,
  GetAvatarAsync,
} from "../redux/actions";
import { MSALWebviewParams } from "react-native-msal";
import { NotesListStatus } from "../redux/actionType";

const mapState = (state: RootState) => ({
  AuthResult: state.authReducer.AuthResult,
  webviewParam: state.authReducer.webviewParameters,
  iosEphemeralSession: state.authReducer.iosEphemeralSession,
  status: state.authReducer.status,
});

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    initAsync: () => dispatch(initAsync()),
    loginAsync: (param: MSALWebviewParams) => dispatch(loginAsync(param)),
    logoutAsync: () => dispatch(logoutAsync()),
    acquireTokenAsync: (forceRefresh: boolean) =>
      dispatch(acquireTokenAsync(forceRefresh)),
    setIosEphemeralSession: (val: boolean) =>
      dispatch(setIosEphemeralSession(val)),
    getAvatarAsync: () => dispatch(GetAvatarAsync()),
  };
};

// init redux property
const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface ProfileProps extends PropsFromRedux {
  navigation: any;
  route: any;
}

const ProfilePage = (props: ProfileProps) => {
  const [avatar, setAvatar] = React.useState("");

  React.useEffect(() => {
    if (!props.AuthResult && props.status === NotesListStatus.idle) {
      props.navigation.navigate("Login");
    }

    props.getAvatarAsync().then((avatarUrl) => {
      if (avatarUrl.payload != null) {
        setAvatar(avatarUrl.payload as string);
      }
    });
  }, [props.AuthResult]);

  if (props.status === NotesListStatus.loading) {
    return (
      <Surface style={styles.surface} elevation={4}>
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      </Surface>
    );
  }

  // TODO: butify this page
  return (
    <Surface style={styles.surface}>
      <ScrollView style={styles.scrollView}>
        <List.Section>
          {props.AuthResult ? (
            <List.Item
              title={(props.AuthResult.account.claims as any)?.name}
              description={props.AuthResult.account.username}
              left={(props) =>
                avatar ? (
                  <List.Icon style={props.style} icon={{ uri: avatar }} />
                ) : (
                  <List.Icon {...props} icon="account" />
                )
              }
            />
          ) : (
            <></>
          )}
          <List.Item
            title="Acquire Token"
            description="Refresh token for your Microsoft account"
            left={(props) => <List.Icon {...props} icon="account-clock" />}
            onPress={() => props.acquireTokenAsync(true)}
          />
          <List.Item
            title="Sign Out"
            description="Sign out of current Microsoft account"
            left={(props) => <List.Icon {...props} icon="account-cancel" />}
            onPress={props.logoutAsync}
          />
        </List.Section>
        <Divider />
        <Text>{JSON.stringify(props.AuthResult, null, 2)}</Text>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    marginTop: "0%",
    marginBottom: "0%",
    paddingBottom: "0%",
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "aliceblue",
    borderWidth: 1,
    margin: "0.5%",
    padding: 8,
    width: "49%",
    alignItems: "center",
  },
  scrollView: {
    padding: 1,
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    maxWidth: "100%",
    flex: 1,
  },
});

export default connector(ProfilePage);
