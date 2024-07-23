import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ListItem from "../components/Home/ListItem";

export default function CategoryList() {
  const [itemListCategory, setitemListCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { params } = useRoute();
  useEffect(() => {
    if (params) {
      getItemByCategory();
    }
  }, [params]);
  const getItemByCategory = async () => {
    setitemListCategory([]);
    setLoading(true);
    try {
      const q = query(
        collection(db, "posts"),
        where("category", "==", params.category)
      );
      const snapshot = await getDocs(q);
      setLoading(false);
      snapshot.docs.map((doc) => {
        setitemListCategory((previousListCategory) => [
          ...previousListCategory,
          doc.data(),
        ]);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching list by category:", error);
    }
  };

  return (
    <View className="px-[16px] bg-white flex-1">
      {loading ? (
        <ActivityIndicator size={"large"} color={"#3b82f6"} />
      ) : itemListCategory?.length > 0 ? (
        <ListItem latestPosts={itemListCategory} heading={""} />
      ) : (
        <Text className="p-5 text-[20px]  text-center mt-[24px] text-gray-300 ">
          No Post Found
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
