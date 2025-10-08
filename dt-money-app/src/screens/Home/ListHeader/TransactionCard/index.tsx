import { useTransactionContext } from "@/context/transaction.context";
import { TransactionTypes } from "@/shared/enums/transaction-types";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { Text, View } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ICONS } from "./strategies/icon-strategy";
import { CARD_DATA } from "./strategies/card-data-strategy";
import { moneyMapper } from "@/shared/utils/money-mapper";
import clsx from "clsx";

export type TransactionCardType = TransactionTypes | "total";

interface Props {
  type: TransactionCardType;
  amount: number;
}

export const TransactionCard: FC<Props> = ({ amount, type }) => {
  const IconData = ICONS[type];
  const cardData = CARD_DATA[type];

  const { transactions, filters } = useTransactionContext();

  const renderDateInfo = () => {
    if (type === "total") {
      return (
        <Text className="text-white text-base">
          {filters.from && filters.to
            ? `${format(filters.from, "dd MMMM", {
                locale: ptBR,
              })} até ${format(filters.to, "dd MMMM", { locale: ptBR })}`
            : "Todo período"}
        </Text>
      );
    } else {
      return (
        <Text className="text-white">
          {lastTransaction?.createdAt
            ? format(
                lastTransaction?.createdAt,
                `'Útima ${cardData.label.toLocaleLowerCase()} em' d 'de' MMMM`,
                { locale: ptBR }
              )
            : "Nenhuma transação encontrada"}
        </Text>
      );
    }
  };

  const lastTransaction = transactions.find(
    ({ type: transactionType }) => transactionType.id === type
  );

  return (
    <View
      className={clsx(
        `bg-${cardData.bgColor} min-w-[280] rounded-[6] px-8 py-6 justify-between mr-6`,
        type === "total" && "mr-12"
      )}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-base">{cardData.label}</Text>
        <MaterialIcons name={IconData.name} color={IconData.color} size={26} />
      </View>
      <View>
        <Text className="text-2xl text-gray-400 font-bold">
          R$ {moneyMapper(amount)}
        </Text>

        {renderDateInfo()}
      </View>
    </View>
  );
};
