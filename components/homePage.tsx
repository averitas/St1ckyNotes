import { Avatar, Surface, Card, PaperProvider, Button } from 'react-native-paper';
import { View } from 'react-native'
import { FontAwesome } from 'react-native-vector-icons';
import NotesList from './notesList';

const HomePage = () => {
  return (
    <Surface>
      <NotesList/>
    </Surface>
  );
};

export default HomePage;