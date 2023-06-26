import React, { useState, useRef, useCallback, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Avatar, Surface, Card, PaperProvider, Button, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux'
import { FontAwesome } from 'react-native-vector-icons';
import { Note } from '../types/note';
import NoteEditor from './noteEditor';
import { AppDispatch, RootState } from '../redux/store';
import { addBlankNote } from '../redux/notesSlice';

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

const mapState = (state: RootState) => ({
  NotesList: state.nodesList.notes,
})

const mapDispatch = (dispatch: AppDispatch) => {
  return {
    // dispatching plain actions
    addBlankNote: () => dispatch(addBlankNote()),
  }
}

// init redux property
const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

interface NotesListProps extends PropsFromRedux {
  navigation: any;
  route: any;
}

const NotesList = (props: NotesListProps) => {
  // relayout according to screen size
  const [numColumns, setNumColumns] = useState<number>(1)
  const [size, onLayout] = useComponentSize();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (props.NotesList.length === 0) {
      return;
    }
    flatListRef.current.scrollToIndex({index: 0, animated: true});
  }, [props.NotesList]);

  const getColumns = (size) => {
    if (size == null) {
      console.log("size is null")
      return;
    }

    console.log('Width: %d, height: %d, widthPerColumn: %d', size.width, size.height, widthPerColumn)
    // Calculate the number of columns based on the width and height of the screen.
    const numColumns = Math.floor(size.width / (widthPerColumn + 40));
    
    // Return the number of columns.
    return numColumns;
  };

  var newNumColumns = getColumns(size);
  if (newNumColumns !== numColumns) {
    setNumColumns(newNumColumns);
  }

  return (
    <Surface style={styles.surface} elevation={4} onLayout={onLayout}>
      <View style={styles.addNoteButton}>
        <TouchableOpacity onPress={props.addBlankNote}>
          <FontAwesome name="plus" size={24} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{maxHeight: size?.height != null ? size.height : "100%", flex: 1}} contentContainerStyle={{flex: 1, maxHeight: "100%"}}>
        <FlatList
          ref={flatListRef}
          scrollToOverflowEnabled={true}
          contentContainerStyle={{flex: 1, maxHeight: "100%"}}
          style={{flex: 1, maxHeight: "100%"}}
          inverted={true}
          key={numColumns}
          data={props.NotesList}
          numColumns={numColumns}
          keyExtractor={(note) => note.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => {
              // Go to edit page
              props.navigation.navigate('NoteEditor', {note: item})
            }}>
              <View style={styles.note}>
              <Card>
                <Card.Title title={item.title} />
                <Card.Content>
                  <Text variant="bodyMedium">{item.content}</Text>
                </Card.Content>
              </Card>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </Surface>
  );
};

export default connector(NotesList);

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
    top: 10,
    left: 10,
  },
  surface: {
    flex: 1,
    marginTop: '0%',
    marginBottom: '0%',
    paddingBottom: '0%',
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
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