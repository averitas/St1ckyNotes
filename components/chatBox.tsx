import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Avatar, Surface, Card, PaperProvider, Button, Text, Modal, TextInput, IconButton, MD3Colors, ActivityIndicator, MD2Colors } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '../redux/store';
import { MSALWebviewParams } from 'react-native-msal';
import { initAsync, loginAsync, logoutAsync, acquireTokenAsync, GetChatOfNoteId, sendChatAsync } from '../redux/actions';
import { ConnectedProps, connect } from 'react-redux';
import { ScrollView, useWindowDimensions } from 'react-native';
import { ChatMessage, ChatType } from '../types/general';
import { NotesListStatus } from '../redux/actionType';
import { updateNote } from '../redux/notesSlice';
import RenderHtml from "react-native-render-html";

const mapState = (state: RootState) => ({
    AuthResult: state.authReducer.AuthResult,
    authStatus: state.authReducer.status,
    NoteMessages: state.backgroundReducer.ChatMessages,
    BackgroundStatus: state.backgroundReducer.status,
})
  
const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    initAsync: () => dispatch(initAsync()),
    loginAsync: (param: MSALWebviewParams) => dispatch(loginAsync(param)),
    logoutAsync: () => dispatch(logoutAsync()),
    acquireTokenAsync: (forceRefresh: boolean) => dispatch(acquireTokenAsync(forceRefresh)),
    sendChatMessageAsync: (message: ChatMessage) => dispatch(sendChatAsync(message)),
    updateNote: (note: Note) => dispatch(updateNote(note)),
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
  setOutputText: (output: string) => void;
}

const ChatBox = (props: ChatBoxProps) => {
  const dimensions = useWindowDimensions();
  const [chatText, setChatText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [chatMessage, setChatMessage] = useState<ChatMessage>(undefined);
  const [chatStatus, setChatStatus] = useState<NotesListStatus>(props.BackgroundStatus);
  const containerStyle = {backgroundColor: 'white', padding: 5, margin: 5, borderRadius: 5};

  useEffect(() => {
    setChatStatus(props.BackgroundStatus);
    const messages = props.NoteMessages;
    let filteredMessages = messages.filter((message) => message.noteId === props.noteEditing.id);
    if (!filteredMessages || filteredMessages.length === 0) {
      console.log('No message found for note: ' + props.noteEditing.id);
      return;
    }
    setResponseText(filteredMessages[0].reply);
    setChatMessage(filteredMessages[0]);
  }, [props.NoteMessages, props.BackgroundStatus]);

  const submitMessage = (message: string) => {
    console.log("Submit message: " + message)
    if (!props.noteEditing.id) {
      props.setError('Please save the note before asking questions.')
      return;
    }

    let newChatMessage: ChatMessage = undefined;
    if (!chatMessage) {
      newChatMessage = {
        sessionId: '',
        noteId: props.noteEditing.id,
        promo: message,
        reply: '',
        type: ChatType.Butify,
        context: [],
      };
    } else {
      newChatMessage = {
        sessionId: chatMessage.sessionId,
        noteId: chatMessage.noteId,
        promo: chatMessage.promo,
        reply: chatMessage.reply,
        type: chatMessage.type,
        context: [...chatMessage.context],
      };
    }
    newChatMessage.promo = props.noteEditing.content;

    if (message === '1') {
      newChatMessage.type = ChatType.Butify;
    } else {
      newChatMessage.type = ChatType.Summary;
    }
    // TODO: send the message to the server.
    props.sendChatMessageAsync(newChatMessage);
    setChatMessage(newChatMessage);
  }

  // TODO: Add a text editor here.
  return (
    <Modal visible={props.visible} 
      style={{height:'100', maxHeight: '100', alignSelf: 'center', padding: 10, justifyContent: 'center', borderRadius: 10}} 
      onDismiss={props.onClose} 
      contentContainerStyle={containerStyle}>
      <Surface style={{alignContent: 'flex-start', flexDirection: 'column', height: 650, maxHeight: 700, borderRadius: 10}}>
        <ScrollView style={{flex:8}}>
          <Text>Return message display here. Reply: </Text>
          {
            chatStatus == NotesListStatus.loading ? 
            <ActivityIndicator
             animating={true}
             color={MD2Colors.red800}
             size="large" /> :
             <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{ height: "100%" }}
            >
              <RenderHtml
                contentWidth={dimensions.width}
                source={{ html: responseText }}
              />
              <Button
                onPress={() => {
                  props.setOutputText(responseText);
                  props.setVisible(false);
                }}> Apply </Button>
              {/* <Markdown>
                  {noteEditing.content}
                </Markdown> */}
            </ScrollView>
          }
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
