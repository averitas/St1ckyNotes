import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

interface TextEditorProps {
  setContent: (content: string) => void;
  content: string;
  height: number;
  width: number;
}

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);
export default function TextEditor(props: TextEditorProps) {
  const richText = React.useRef();

  return (
    <SafeAreaView style={{flex: 1, width: props.width, height: props.height}}>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <RichEditor
            ref={richText}
            onChange={(descriptionText) => {
              console.log("descriptionText:", descriptionText);
              props.setContent(descriptionText);
            }}
            autoCorrect={false}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.heading2,
          actions.heading3,
          actions.fontSize,
          actions.fontSize,
        ]}
        iconMap={{ [actions.heading1]: handleHead }}
      />
    </SafeAreaView>
  );
}
