import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Avatar, Surface, Card, PaperProvider, Button, Text, Appbar, TextInput, SurfaceProps, Portal, Snackbar } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '../redux/store';
import { updateNote } from '../redux/notesSlice';
import { ConnectedProps, connect } from 'react-redux';
import ReactMarkdown from 'react-markdown'
import Markdown from 'react-native-markdown-display';
import RenderHtml from 'react-native-render-html';
import TextEditor from './editor/textEditor';
import { CreateNotesAsync, UpdateNotesAsync } from '../redux/actions';
import ChatBox from './chatBox';
declare module 'react-native-markdown-display' {
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  interface MarkdownProps {
    children?: React.ReactNode;
  }
}

const mapState = (state: RootState) => ({
  NotesList: state.nodesList.notes,
})

const useComponentSize = () => {
  const [size, setSize] = useState(null);

  const onLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    console.log('Editor Width: %d, height: %d', width, height)
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    updateNote: (note: Note) => dispatch(updateNote(note)),
    UpdateNoteAsync: (note: Note) => dispatch(UpdateNotesAsync(note)),
    CreateNoteAsync: (note: Note) => dispatch(CreateNotesAsync(note)),
  }
}

// init redux property
const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

interface NoteEditorProps extends PropsFromRedux {
  navigation: any;
  route: any;
}

const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>
const NoteEditor = (props:NoteEditorProps) => {
  const editorSurface = React.useRef<View>();

  useEffect(() => {
    for (let i = 0; i < props.NotesList.length; i++) {
      if (props.NotesList[i].localId === noteEditing.localId) {
        console.log('Found the note that updated, id: ' + props.NotesList[i].id, ", localId: " + noteEditing.localId);
        setNoteEditing(props.NotesList[i]);
        break;
      }
    }
  }, [props.NotesList])

  // use header to switch between edit and view mode.
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [noteEditing, setNoteEditing] = useState<Note>(props.route.params.note)
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false)
  const [warnVisible, setWarnVisible] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const [editorSurfaceSize, onEditorSurfaceLayout] = useComponentSize();

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const toggleWarning = () => {
    setWarnVisible(!warnVisible);
    setErrorMessage('');
  }

  const showError = (error: string) => {
    setErrorMessage(error);
    setWarnVisible(true);
  }

   // TODO: Add a text editor here.
  return (
    <Surface style={{ flex: 1, height: '100%', width: '100%' }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Appbar.Content title={
          isEditingTitle ?
          <TextInput value={noteEditing.title} onChangeText={text => {
            setNoteEditing({...noteEditing, title: text})
          }} onBlur={e => setIsEditingTitle(false)} /> :
          <Text variant="headlineSmall" onPress={e => setIsEditingTitle(true)}>{noteEditing.title}</Text>} />
        <Appbar.Action icon="content-save" onPress={async () => {
          if (noteEditing.isDraft) {
            await props.CreateNoteAsync({...noteEditing, date: new Date().toISOString()});
          } else {
            await props.UpdateNoteAsync({...noteEditing, date: new Date().toISOString()});
          }
        }} />
        <Appbar.Action icon={isEditing ? "eye" : "file-document-edit"} onPress={() => {
          setIsEditing(!isEditing);
        }} />
        <Appbar.Action icon="chat-outline" onPress={toggleChat} />
      </Appbar.Header>
      <Surface 
        style={styles.surface}
        ref={editorSurface}
        onLayout={onEditorSurfaceLayout}
        >
          {isChatVisible &&
          <Portal>
            <ChatBox 
              onClose={() => setIsChatVisible(false)}
              visible={isChatVisible}
              setVisible={setIsChatVisible}
              noteEditing={noteEditing}
              setNoteEditing={setNoteEditing}
              setError={showError}
              />
          </Portal>
           }
          {
            isEditing ? (<TextEditor 
              setContent={(content) => {setNoteEditing({...noteEditing, content: content})}} 
              content={noteEditing.content}
              width={editorSurfaceSize?.width ?? 300}
              height={editorSurfaceSize?.width ?? 600}/>) :
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{height: '100%'}}>
              <RenderHtml
                contentWidth={editorSurfaceSize?.width ?? 300}
                source={{ html: noteEditing.content }}
              />
              {/* <Markdown>
                {noteEditing.content}
              </Markdown> */}
            </ScrollView>
          }
      </Surface>
      {
        warnVisible &&
        <Portal>
          <Snackbar
            visible={warnVisible}
            style={{zIndex: Number.MAX_SAFE_INTEGER}}
            onDismiss={toggleWarning}
            action={{
              label: 'Close',
              onPress: toggleWarning,
            }}>
            {errorMessage}
          </Snackbar>
        </Portal>
      }
      
    </Surface>
  );
};

const styles = StyleSheet.create({
  textInputContent: { 
    flex: 1, 
    paddingVertical: 0, 
    textAlignVertical: 'top', 
    textAlign: 'left',
    paddingTop: 5,
    marginTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    paddingLeft: 0,
    paddingRight: 0,
  },
  textInput: {
    flex: 1, 
    height: 500, 
    paddingVertical: 3
  },
  surface: {
    flex: 1,
    alignItems: 'stretch',
    alignContent: 'stretch'
  },
})
  
export default connector(NoteEditor);
