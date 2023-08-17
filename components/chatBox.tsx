import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Avatar, Surface, Card, PaperProvider, Button, Text, Modal, TextInput, IconButton, MD3Colors } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '../redux/store';
import { MSALWebviewParams } from 'react-native-msal';
import { initAsync, loginAsync, logoutAsync, acquireTokenAsync } from '../redux/actions';
import { ConnectedProps, connect } from 'react-redux';
import { ScrollView } from 'react-native';

const mapState = (state: RootState) => ({
    AuthResult: state.authReducer.AuthResult,
    status: state.authReducer.status,
  })
  
const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    initAsync: () => dispatch(initAsync()),
    loginAsync: (param: MSALWebviewParams) => dispatch(loginAsync(param)),
    logoutAsync: () => dispatch(logoutAsync()),
    acquireTokenAsync: (forceRefresh: boolean) => dispatch(acquireTokenAsync(forceRefresh))
  }
}
  
// init redux property
const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

interface ChatBoxProps extends PropsFromRedux {
  onClose: () => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
  noteEditing: Note;
  setNoteEditing: (note: Note) => void;
  setError: (error: string) => void;
}

const ChatBox = (props: ChatBoxProps) => {
  const [chatText, setChatText] = useState('');
  const containerStyle = {backgroundColor: 'white', padding: 5, margin: 5, borderRadius: 5};

  const submitMessage = (message: string) => {
    console.log("Submit message: " + message)
    if (!props.noteEditing.id) {
      props.setError('Please save the note before asking questions.')
      return;
    }

    // TODO: send the message to the server.
  }

  // TODO: Add a text editor here.
  return (
    <Modal visible={props.visible} 
      style={{height:'100', maxHeight: '100', alignSelf: 'center', padding: 10, justifyContent: 'center', borderRadius: 10}} 
      onDismiss={props.onClose} 
      contentContainerStyle={containerStyle}>
      <Surface style={{alignContent: 'flex-start', flexDirection: 'column', height: 650, maxHeight: 700, borderRadius: 10}}>
        <ScrollView style={{flex:8}}>
          <Text>Return message display here.</Text>
        </ScrollView>
        <Surface style={{alignContent: 'center', flexDirection: 'row', flex: 1}}>
          <TextInput
            label="Ask question about this note."
            contentStyle={{fontSize: 15}}
            value={chatText}
            onChangeText={(text) => setChatText(text)}
            onSubmitEditing={e => submitMessage(e.nativeEvent.text)}
            style={{borderRadius: 5, width: '100%', flex: 8}}
            right={<TextInput.Icon icon="send" 
                    onPress={e => submitMessage(chatText)}
                    style={{alignContent: 'center', justifyContent: 'center', alignSelf: 'center'}} />}
          />
        </Surface>
      </Surface>
    </Modal>
  );
};
  
export default connector(ChatBox);
