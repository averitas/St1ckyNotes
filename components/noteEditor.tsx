import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Surface, Card, PaperProvider, Button, Text, Appbar, TextInput, SurfaceProps } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '../redux/store';
import { updateNote } from '../redux/notesSlice';
import { ConnectedProps, connect } from 'react-redux';
import ReactMarkdown from 'react-markdown'
import Markdown from 'react-native-markdown-display';
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
    console.log("layout is " + event.nativeEvent.layout)
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    updateNote: (note: Note) => dispatch(updateNote(note)),
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
  // use header to switch between edit and view mode.
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [noteEditing, setNoteEditing] = useState<Note>(props.route.params.note)

  const [editorSurfaceSize, onEditorSurfaceLayout] = useComponentSize();

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
        <Appbar.Action icon="content-save" onPress={() => {
          props.updateNote({...noteEditing, date: new Date().toString()});
        }} />
        <Appbar.Action icon={isEditing ? "eye" : "file-document-edit"} onPress={() => {
          setIsEditing(!isEditing);
        }} />
      </Appbar.Header>
      <Surface 
        style={styles.surface} 
        ref={editorSurface}
        onLayout={onEditorSurfaceLayout}
        >
          {
            isEditing ? 
            <TextInput
              multiline={true}
              value={noteEditing.content}
              onChangeText={text => setNoteEditing({...noteEditing, content: text})}
                style={{ flex: 1, height: editorSurfaceSize?.height ?? 500 }}
              contentStyle={styles.textInputContent}
            /> : 
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{height: '100%'}}>
              <Markdown>
                {noteEditing.content}
              </Markdown>
            </ScrollView>
          }
      </Surface>
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
