import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
export default function Categories({ categoryList }) {
  const navigation = useNavigation();
  return (
    <View className="mt-2">
      <View className="flex-row justify-between align-middle">
        <Text className="font-bold text-[18px] ml-2">Categories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("allcategories")}
          style={{
            elevation: 5,
            borderWidth: 1,
            borderColor: "red",
            borderRadius: 20,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 6,
          }}
        >
          <Text className="text-[12px] p-1 text-red-500 text-center">
            Show All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) =>
          index <= 7 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("category-list", {
                  category: item.name,
                })
              }
              className="flex-1 items-center justify-center m-2 border-[1px] border-blue-200 rounded-lg h-[80px] bg-[#E0F7FA] p-1"
            >
              <Image
                source={{ uri: item.icon }}
                className="w-[35px] h-[35px] items-center"
              />
              <Text className="text-[12px] mt-1 text-center">{item.name}</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
