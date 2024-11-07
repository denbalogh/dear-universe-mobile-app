import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput as NativeTextInput,
} from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { spacing } from "@/constants/theme";
import BottomButtons from "../BottomButtons/BottomButtons";

export type TitleDescriptionEditorProps = {
  initialTitle: string;
  initialDescription: string;
  onSubmit: (payload: { title: string; description: string }) => void;
  onBackPress: () => void;
  focusTitle?: boolean;
  focusDescription?: boolean;
};

const TitleDescriptionEditor = ({
  initialTitle,
  initialDescription,
  onSubmit,
  onBackPress,
  focusDescription,
  focusTitle,
}: TitleDescriptionEditorProps) => {
  const theme = useTheme();

  const [isDiscardDialogVisible, setIsDiscardDialogVisible] = useState(false);

  const hideDiscardDialog = () => setIsDiscardDialogVisible(false);
  const showDiscardDialog = () => setIsDiscardDialogVisible(true);

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const titleRef = useRef<NativeTextInput>(null);
  const descriptionRef = useRef<NativeTextInput>(null);

  const isTitleEdited = title !== initialTitle;
  const isDescriptionEdited = description !== initialDescription;
  const isEdited = isTitleEdited || isDescriptionEdited;

  useEffect(() => {
    if (focusTitle && titleRef.current) {
      titleRef.current.focus();
    } else if (focusDescription && descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [focusTitle, focusDescription]);

  const handleBackPress = () => {
    if (isEdited) {
      showDiscardDialog();
    } else {
      onBackPress();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
      <IconButton
        icon="arrow-left"
        onPress={handleBackPress}
        accessibilityLabel="Go back"
      />
      <ScrollView
        style={styles.inputsWrapper}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          multiline={true}
          style={styles.input}
          ref={titleRef}
          outlineColor={isTitleEdited ? theme.colors.primary : undefined}
          textAlignVertical="top"
          scrollEnabled={false}
          placeholder="Enter title"
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline={true}
          style={styles.input}
          ref={descriptionRef}
          outlineColor={isDescriptionEdited ? theme.colors.primary : undefined}
          textAlignVertical="top"
          scrollEnabled={false}
          placeholder="Enter description"
        />
      </ScrollView>
      <BottomButtons
        buttons={[
          {
            onPress: handleBackPress,
            textColor: isEdited ? theme.colors.error : undefined,
            children: isEdited ? "Discard" : "Close",
          },
          {
            onPress: () => onSubmit({ title, description }),
            mode: "contained",
            children: "Save",
            disabled: !isEdited,
          },
        ]}
        style={styles.buttonsWrapper}
      />
      <Portal>
        <Dialog visible={isDiscardDialogVisible} onDismiss={hideDiscardDialog}>
          <Dialog.Content>
            <Text variant="bodyLarge">
              Do you really wish to discard the changes?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDiscardDialog}>Close</Button>
            <Button
              onPress={onBackPress}
              textColor={theme.colors.error}
              style={styles.dialogConfirmButton}
            >
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

export default TitleDescriptionEditor;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },
  inputsWrapper: {
    flex: 1,
    marginHorizontal: -spacing.spaceMedium,
    paddingHorizontal: spacing.spaceMedium,
  },
  input: {
    marginTop: spacing.spaceMedium,
  },
  buttonsWrapper: {
    marginTop: spacing.spaceMedium,
  },
  dialogConfirmButton: {
    marginLeft: spacing.spaceSmall,
  },
});
