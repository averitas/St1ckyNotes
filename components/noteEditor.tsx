import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Avatar, Surface, Card, PaperProvider, Button, Text } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch, RootState } from '../redux/store';
import { updateNote } from '../redux/notesSlice';
import { ConnectedProps, connect } from 'react-redux';

const mapState = (state: RootState) => ({
  NotesList: state.nodesList.notes,
})

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    updateNote: dispatch(updateNote),
  }
}

// init redux property
const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

interface NoteEditorProps extends PropsFromRedux {
  navigation: any;
  route: any;
}

const NoteEditor = (props:NoteEditorProps) => {
    // TODO: Add a text editor here.
    return (
      <Surface>
        <Text>Note id: {props.route.params.note.id}</Text>
        <Text>Note Title: {props.route.params.note.title}</Text>
        <Text>Note Content: {props.route.params.note.content}</Text>
      </Surface>
    );
  };
  
  export default NoteEditor;
