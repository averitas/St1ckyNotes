/**
 * Example for a Azure B2C application using a B2CClient helper class
 */

import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity } from 'react-native';
import { ConnectedProps, connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { initAsync, loginAsync, logoutAsync, acquireTokenAsync, setIosEphemeralSession } from '../redux/authSlice';

const mapState = (state: RootState) => ({
  AuthResult: state.authReducer.AuthResult,
  webviewParam: state.authReducer.webviewParameters,
  iosEphemeralSession: state.authReducer.iosEphemeralSession,
})

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    initAsync: () => dispatch(initAsync()),
    loginAsync: (param) => dispatch(loginAsync(param)),
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
    console.log("initasync is " + props.initAsync)
    props.initAsync();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        {props.AuthResult ? (
          <>
            <TouchableOpacity style={styles.button} onPress={() => props.acquireTokenAsync(true)}>
              <Text>Acquire Token (Silent)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={props.logoutAsync}>
              <Text>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={props.loginAsync}>
            <Text>Sign In</Text>
          </TouchableOpacity>
        )}

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.button, styles.switchButton]}
            onPress={() => props.setIosEphemeralSession(!props.iosEphemeralSession)}
          >
            <Text>Prefer ephemeral browser session (iOS only)</Text>
            <Switch value={props.iosEphemeralSession} />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.scrollView}>
        <Text>{JSON.stringify(props.AuthResult, null, 2)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '1%',
    backgroundColor: 'white',
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
    borderWidth: 1,
    padding: 1,
  },
});

export default connector(LoginPage);
