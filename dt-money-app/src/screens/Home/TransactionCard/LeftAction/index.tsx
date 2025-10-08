import { Transaction } from "@/shared/interfaces/transaction";
import { FC } from "react";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/shared/colors";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { EditTransaction } from "./EditTransactionForm";

interface Params {
  transaction: Transaction;
}

export const LeftAction: FC<Params> = ({ transaction }) => {
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <Pressable
      onPress={() =>
        openBottomSheet(<EditTransaction transaction={transaction} />, 0)
      }
    >
      <View className="h-[140] bg-accent-blue-dark w-[80] rounded-l-[6] items-center justify-center">
        <MaterialIcons name="edit" size={30} color={colors.white} />
      </View>
    </Pressable>
  );
};
