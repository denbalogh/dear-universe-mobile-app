import React, { useState } from "react";
import { TextInput, TextInputProps } from "react-native-paper";

type Props = {
  label?: string;
  code: string;
  onCodeChange: (code: string) => void;
  textInputProps?: Omit<TextInputProps, "label" | "value" | "onChangeText">;
};

const CodeInput = ({
  label = "Code",
  code,
  onCodeChange,
  textInputProps,
}: Props) => {
  const [isSecure, setIsSecure] = useState(true);

  const toggleIsSecure = () => setIsSecure((prev) => !prev);

  return (
    <TextInput
      label={label}
      value={code}
      onChangeText={onCodeChange}
      mode="outlined"
      secureTextEntry={isSecure}
      maxLength={6}
      keyboardType="number-pad"
      inputMode="numeric"
      right={
        <TextInput.Icon
          icon={isSecure ? "eye-off" : "eye"}
          onPress={toggleIsSecure}
          forceTextInputFocus={false}
        />
      }
      {...textInputProps}
    />
  );
};

export default CodeInput;
