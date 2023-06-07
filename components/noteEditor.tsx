import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Avatar, Surface, Card, PaperProvider, Button, Text } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';


const NoteEditor = ({ note, onSave }) => {
    const [content, setContent] = useState(note.content);
  
    const handleSave = () => {
      onSave({
        content,
        id: note.id,
      });
    };
  
    // TODO: Add a text editor here.
    return (
      <div>
        <Text>Place Holder for editor</Text>
      </div>
    );
  };
  
  export default NoteEditor;
