import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Avatar, Surface, Card, PaperProvider, Button } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons';

const LeftContent = props => <Avatar.Icon {...props} icon="text" />

const App = () => {
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    const newNote = {
      title: '1111',
      content: '1111',
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((note, i) => i !== index));
  };

  return (
    <Surface style={styles.surface} elevation={4}>
      <ScrollView >
        <FlatList
          data={notes}
          numColumns={2}
          keyExtractor={(note) => note.id}
          renderItem={({ item }) => (
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

export default App;

const styles = StyleSheet.create({
  note: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
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
    padding: 8,
    height: "90%",
    width: "90%",
    alignItems: 'center',
    justifyContent: 'center',
  },
});