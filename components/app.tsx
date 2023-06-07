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
import NotesList from './notesList';

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

const App = () => {
  return (
      <NotesList />
  );
};

export default App;