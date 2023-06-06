import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Avatar, Surface, Card, PaperProvider, Button } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';

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
  const [notes, setNotes] = useState([]);
  const [numColumns, setNumColumns] = useState(1)
  const [size, onLayout] = useComponentSize();

  const addNote = () => {
    const newNote = new Note(uuidv4(), "New Note", "New Note Content", new Date().toString(), []);
    setNotes([...notes, newNote]);
  };

  const getColumns = (size) => {
    if (size == null) {
      console.log("size is null")
      return;
    }

    console.log('Width: %d, height: %d, widthPerColumn: %d', size.width, size.height, widthPerColumn)
    // Calculate the number of columns based on the width and height of the screen.
    const numColumns = Math.floor(size.width / (widthPerColumn + 90));
    
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
                <Card.Title title={item.title} left={LeftContent} />
                <Card.Content>
                  <Text variant="titleLarge">{item.title}</Text>
                  <Text variant="bodyMedium">{item.content}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button><Text>Edit</Text></Button>
                  <Button><Text>Delete</Text></Button>
                </Card.Actions>
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
    width: {widthPerColumn},
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
    marginTop: '10%',
    height: "90%",
    width: "90%",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});