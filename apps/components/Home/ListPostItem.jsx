import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ListPostItem({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("product-detail", { itemDetail: item })
      }
      className="  m-2 p-2  rounded-lg w-[45%]"
      style={{ elevation: 3, backgroundColor: "white" }}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-[120px] rounded-lg object-contain"
      />
      <View className="justify-center items-center">
        <Text className="text-[15px] mt-1 font-bold text-[#333333] text-center">
          {item.title}
        </Text>
        <Text className="text-[16px] mt-1 font-bold text-[#4169E1]">
          $ {item.price}
        </Text>
        <Text className="text-[15px] mt-1 font-bold text-blue-600 bg-[#E8F5E9] rounded-full text-center p-2 w-[120px] shadow-lg">
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
