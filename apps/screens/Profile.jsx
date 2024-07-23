import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Box from "../../assets/images/box.png";
import Switch from "../../assets/images/switch.png";
import Adventurer from "../../assets/images/adventurer.png";
import Gift from "../../assets/images/gift-box.png";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const { isLoaded, signOut } = useAuth();
  console.log(signOut);
  const navigation = useNavigation();
  const { user } = useUser();
  const menuList = [
    { id: 1, name: "My Products", icon: Box, path: "my-product" },
    { id: 2, name: "Explore", icon: Adventurer, path: "Explore" },
    { id: 3, name: "Jaidi", icon: Gift, path: "" },
    { id: 4, name: "Logout", icon: Switch, path: "Logout" },
  ];
  const onMenuPress = (item) => {
    if (item.path === "Logout") {
      signOut();
      return;
    }
    item?.path ? navigation.navigate(item.path) : null;
  };
  const _renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => onMenuPress(item)}
      style={{ elevation: 2 }}
      className="flex-1 items-center justify-center my-4   m-3 rounded-3xl p-3 bg-[#E0F7FA]"
    >
      <Image source={item.icon} className="h-[50px] w-[50px] " />
      <Text className="text-gray-500 text-[16px] text-center mt-1">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className=" bg-white flex-1">
      <View className="items-center mt-14">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-[100px] h-[100px] rounded-full"
        />
        <Text className="font-bold text-[22px] mt-3">{user?.fullName}</Text>
        <Text className="text-[18px] mt-1 text-gray-500">
          {user?.primaryEmailAddress.emailAddress}
        </Text>
      </View>
      <FlatList data={menuList} numColumns={3} renderItem={_renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({});
