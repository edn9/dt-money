import { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";

export const DismissKeyboardView: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView>{children}</ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
