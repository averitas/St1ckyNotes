import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Avatar, Surface, Card, PaperProvider, Button, Text } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import NoteEditor from './noteEditor';

const LeftContent = props => <Avatar.Icon {...props} icon="text" />


const useComponentSize = () => {
  const [size, setSize] = useState(null);

  const onLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    console.log("layout is " + event.nativeEvent.layout)
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

const widthPerColumn = 150;
const notesPadding = 10;

const NotesList = () => {
  const [notes, setNotes] = useState<Array<Note>>([]);
  const [numColumns, setNumColumns] = useState<number>(1)
  const [size, onLayout] = useComponentSize();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note>(undefined);

  const addNote = () => {
    const newNote: Note = {
      id: uuidv4(), 
      title: "New Note", 
      content: "New Note Content", 
      date: new Date().toString(), 
      tags: []};
    setNotes([...notes, newNote]);
  };

  const getColumns = (size) => {
    if (size == null) {
      console.log("size is null")
      return;
    }

    console.log('Width: %d, height: %d, widthPerColumn: %d', size.width, size.height, widthPerColumn)
    // Calculate the number of columns based on the width and height of the screen.
    const numColumns = Math.floor(size.width / (widthPerColumn + 60));
    
    // Return the number of columns.
    return numColumns;
  };

  var newNumColumns = getColumns(size);
  if (newNumColumns !== numColumns) {
    setNumColumns(newNumColumns);
  }

  const deleteNote = (index) => {
    setNotes(notes.filter((note, i) => i !== index));
  };

  return (
    <Surface style={styles.surface} elevation={4} onLayout={onLayout}>
      { 
        isEditing && 
        <View style={styles.editor}>
          <NoteEditor note={editingNote} onSave={setEditingNote}/> 
        </View>
      }
      <ScrollView >
        <FlatList
          key={numColumns}
          data={notes}
          numColumns={numColumns}
          keyExtractor={(note) => note.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => {
              // Go to edit page
            }}>
              <View style={styles.note}>
              <Card>
                <Card.Title title={index} left={LeftContent} />
                <Card.Content>
                  <Text variant="titleLarge">{item.title}</Text>
                  <Text variant="bodyMedium">{item.content}</Text>
                </Card.Content>
              </Card>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      <View style={styles.addNoteButton}>
        <TouchableOpacity onPress={addNote}>
          <FontAwesome name="plus" size={24} />
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default NotesList;

const styles = StyleSheet.create({
  note: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: widthPerColumn,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
  },
  addNoteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  surface: {
    marginTop: '3%',
    height: "90%",
    width: "90%",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editor: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 400,
    height: 200,
    background: 'white',
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});