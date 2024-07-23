import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const { user } = useUser();
  return (
    <View>
      {/* User Info Section */}
      <View className="flex flex-row items-center gap-4">
        <Image
          source={{ uri: user?.imageUrl }}
          className="rounded-full w-12 h-12"
        />
        <View>
          <Text className="text-[16px] text-red-500">Welcome</Text>
          <Text className="text-[18px] font-bold">{user?.fullName}</Text>
        </View>
      </View>
      {/* Search Bar */}
      <View
        style={{ elevation: 1 }}
        className="p-[9px] px-4 rounded-full mt-5 flex flex-row items-center border-blue-200 border-[1px] bg-blue-50"
      >
        <Ionicons name="search-outline" size={24} color="gray" />
        <TextInput
          placeholder="Search"
          className="ml-3 text-[18px]"
          onChangeText={(e) => console.log(e)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
