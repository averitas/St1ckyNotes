import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView, ScrollView } from "react-native";
import { Avatar, Surface, Card, PaperProvider, Button, Text, Appbar } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '../redux/store';
import { updateNote } from '../redux/notesSlice';
import { ConnectedProps, connect } from 'react-redux';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const mapState = (state: RootState) => ({
  NotesList: state.nodesList.notes,
})

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
   const richText = React.useRef();
   let note: Note = props.route.params.note;
   // TODO: Add a text editor here.
   return (
    <Surface style={{ flex: 1, height: '100%', width: '100%' }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.navigate('Notes')} />
        <Appbar.Content title={note.title} />
        <Appbar.Action icon="content-save" onPress={() => {props.updateNote(note)}} />
      </Appbar.Header>
      <Text>Note id: {props.route.params.note.id}</Text>
      <Text>Note Title: {props.route.params.note.title}</Text>
      <Text>Note Content: {props.route.params.note.content}</Text>

      <ScrollView style={{ flex: 1, height: '100%', width: '100%' }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}	
          style={{ flex: 1, height: '100%', width: '100%' }}>
          <Text>Description: </Text>
            <RichEditor
                ref={richText}
                onChange={ descriptionText => {
                    note.content = descriptionText;
                }}
            />
        </KeyboardAvoidingView>
      </ScrollView>
      <RichToolbar
        editor={richText}
        actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1 ]}
        iconMap={{ [actions.heading1]: handleHead }}
      />
    </Surface>
  );
};

  
export default connector(NoteEditor);
