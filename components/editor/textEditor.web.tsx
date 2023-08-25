import React, { useRef } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import { SafeAreaView, Text } from 'react-native'
import { Surface } from 'react-native-paper';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface TextEditorProps {
  setContent: (content: string) => void;
  content: string;
  height: number;
  width: number;
}

export default function TextEditor(props: TextEditorProps) {
  const [editorState, setEditorState] = React.useState(EditorState.createWithContent(stateFromHTML(props.content)));
  const editor = React.useRef(null);

  return (
    <SafeAreaView style={{flex: 1, maxHeight: '95%', width: props.width, height: props.height * 0.95 }}>
      <Editor
          style={{width: props.width}}
          editorState={editorState}
          ref={editor}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          wrapperStyle={{height: '100%'}}
          editorStyle={{height: '98%'}}
          onEditorStateChange={(es) => {
            setEditorState(es);
            props.setContent(stateToHTML(es.getCurrentContent()));
          }}
        />
      </SafeAreaView>
  );
}