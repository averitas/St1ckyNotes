/**
 * Example for a Azure B2C application using a B2CClient helper class
 */

import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity } from 'react-native';
import { ConnectedProps, connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setIosEphemeralSession } from '../redux/authSlice';
import { initAsync, loginAsync, logoutAsync, acquireTokenAsync } from '../redux/actions';
import { NotesListStatus } from '../redux/actionType';
import { MSALWebviewParams } from 'react-native-msal';
import { ActivityIndicator, Divider, List, MD2Colors, Surface } from 'react-native-paper';

const mapState = (state: RootState) => ({
  AuthResult: state.authReducer.AuthResult,
  webviewParam: state.authReducer.webviewParameters,
  iosEphemeralSession: state.authReducer.iosEphemeralSession,
  status: state.authReducer.status,
})

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    initAsync: () => dispatch(initAsync()),
    loginAsync: (param: MSALWebviewParams) => dispatch(loginAsync(param)),
    logoutAsync: () => dispatch(logoutAsync()),
    acquireTokenAsync: (forceRefresh: boolean) => dispatch(acquireTokenAsync(forceRefresh)),
    setIosEphemeralSession: (val: boolean) => dispatch(setIosEphemeralSession(val))
  }
}

// init redux property
const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

interface LoginProps extends PropsFromRedux {
  navigation: any;
  route: any;
}

const LoginPage = (props: LoginProps) => {
  React.useEffect(() => {
    if (props.AuthResult && props.status === NotesListStatus.idle) {
      props.navigation.navigate('Profile');
    }
  }, [props.AuthResult]);

  if (props.status === NotesListStatus.loading) {
    return (
      <Surface style={styles.surface} elevation={4}>
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      </Surface>
    )
  }

  return (
    <Surface style={styles.surface} elevation={4}>
      <View style={styles.buttonContainer}>
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.button, styles.switchButton]}
            onPress={() => props.setIosEphemeralSession(!props.iosEphemeralSession)}
          >
            <Text>Prefer ephemeral browser session (iOS only)</Text>
            <Switch value={props.iosEphemeralSession}  onValueChange={(val) => {props.setIosEphemeralSession(val)}}/>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.scrollView} >
        <List.Section>
          <List.Item
            title="First Item"
            description="Item description"
            left={props => <List.Icon {...props} icon="folder" />}
          />
          {props.AuthResult ? (
            <List.Item title="Not Login" left={() => <List.Icon icon="account-alert" />} />
          ) : (
            <List.Item title="Sign In"
              description="Login your microsoft account"
              left={props => <List.Icon {...props} icon="account-arrow-left" />}
              onPress={() => props.loginAsync(props.webviewParam)}
            />
          )}

        </List.Section>
        <Divider />
        <Text>{JSON.stringify(props.AuthResult, null, 2)}</Text>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    marginTop: '0%',
    marginBottom: '0%',
    paddingBottom: '0%',
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: '1%',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: '1%',
    margin: '-0.5%',
  },
  button: {
    backgroundColor: 'aliceblue',
    borderWidth: 1,
    margin: '0.5%',
    padding: 8,
    width: '49%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 4,
    margin: '0.5%',
    width: '99%',
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

export default connector(LoginPage);
