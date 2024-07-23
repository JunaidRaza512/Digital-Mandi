import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import ListItem from "../components/Home/ListItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function MyProductScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigation = useNavigation();
  /*  useEffect(() => {
    user && getPosts();
  }, [user]);
  useEffect(() => {
    navigation.addListener("focus", (e) => {
      console.log("ki haal ae");
      getPosts();
    });
  }, [navigation]); */
  useFocusEffect(
    React.useCallback(() => {
      // Runs when the screen comes into focus
      user && getPosts();
      console.log("oye hoye");
    }, [])
  );
  const getPosts = async () => {
    setPosts([]);
    setLoading(true);
    const q = query(
      collection(db, "posts"),
      where("userEmail", "==", user?.primaryEmailAddress.emailAddress),
      orderBy("createdAt", "desc")
    );
    const snapShot = await getDocs(q);
    setLoading(false);
    snapShot.forEach((doc) =>
      setPosts((previousPosts) => [...previousPosts, doc.data()])
    );
    setLoading(false);
  };
  return (
    <View className="bg-white flex-1 px-3">
      {loading ? (
        <ActivityIndicator size={"large"} color={"#3b82f6"} />
      ) : posts?.length > 0 ? (
        <ListItem latestPosts={posts} heading={""} />
      ) : (
        <Text className="p-5 text-[20px]  text-center mt-[24px] text-gray-300 ">
          No Item Listed by you
        </Text>
      )}
    </View>
  );
}
