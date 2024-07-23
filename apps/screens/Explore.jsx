import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ListItem from "../components/Home/ListItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function Explore() {
  const [getPost, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    fetchPosts();
  }, []);

  /* useFocusEffect(
    React.useCallback(() => {
      navigation.addListener("focus", () => {
        // Code to run when the screen is focused
        fetchPosts();
      });
    }, [])
  ); */
  const fetchPosts = async () => {
    setPosts([]);
    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      const querySnapShot = await getDocs(postsQuery);
      querySnapShot.forEach((doc) => {
        setPosts((previousPosts) => [...previousPosts, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="px-3 bg-white flex-1 ">
      <View>
        <ListItem
          latestPosts={getPost}
          heading={"Explore More"}
          fetchPosts={fetchPosts}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
