import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function AllCategories() {
  const navigation = useNavigation();
  const [category, setcategory] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setcategory([]);
    try {
      const querySnapShot = await getDocs(collection(db, "Category"));
      const data = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setcategory(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };
  return (
    <View className="bg-white flex-1 p-2">
      {category ? (
        <FlatList
          data={category}
          numColumns={2}
          renderItem={({ item, index }) => (
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
              <Text className="text-[16px] mt-1 text-center">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});
