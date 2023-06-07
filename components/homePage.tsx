import { Avatar, Surface, Card, PaperProvider, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native'
import { FontAwesome } from 'react-native-vector-icons';
import NotesList from './notesList';

const HomePage = () => {
  return (
    <Surface style={styles.surface}>
      <NotesList/>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: "center",
  },
});

export default HomePage;