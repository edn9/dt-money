import { useTransactionContext } from "@/context/transaction.context";
import Checkbox from "expo-checkbox";
import { Text, TouchableOpacity, View } from "react-native";

export const CategoryFilters = () => {
  const { categories, handleCategoryFilters, filters } =
    useTransactionContext();

  return (
    <View className="mb-6">
      <Text className="text-base font-medium mb-5 text-gray-600">
        Categorias
      </Text>

      {categories.map(({ id, name }) => (
        <TouchableOpacity
          onPress={() => handleCategoryFilters(id)}
          className="flex-row items-center py-2"
          key={`category-${id}`}
        >
          <Checkbox
            onValueChange={() => handleCategoryFilters(id)}
            value={Boolean(filters.categoryIds[id])}
            className="mr-4"
          />
          <Text className="text-lg text-white">{name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
