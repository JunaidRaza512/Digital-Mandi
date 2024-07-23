import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Header from "../components/Home/Header";
import Slider from "../components/Home/Slider";
import Categories from "../components/Home/Categories";
import ListItem from "../components/Home/ListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // render only once for the first time
    fetchData();
  }, []);

  /* useFocusEffect(
    React.useCallback(() => {
      // Runs when the screen comes into focus

      fetchData();
      console.log("oye hoye");
    }, [navigation])
  ); */
  const fetchData = async () => {
    setLoading(true);
    try {
      const sliders = await getSliders();
      const categories = await fetchCategories();
      const posts = await fetchPosts();
      setData([
        { type: "header" },
        { type: "slider", data: sliders },
        { type: "categories", data: categories },
        { type: "post", data: posts },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getSliders = async () => {
    try {
      const querySnapShot = await getDocs(collection(db, "Sliders"));
      return querySnapShot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapShot = await getDocs(collection(db, "Category"));
      return querySnapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const fetchPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      const querySnapShot = await getDocs(postsQuery);
      return querySnapShot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "header":
        return <Header />;
      case "slider":
        return <Slider sliderList={item.data} />;
      case "categories":
        return <Categories categoryList={item.data} />;
      case "post":
        return (
          <ListItem latestPosts={item.data} heading={"Complete Collection"} />
        );
      default:
        return null;
    }
  };
  /* const renderFooter = () => {
    return loading ? (
      <ActivityIndicator size="large" color="red" style={styles.footer} />
    ) : null;
  }; */

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.contentContainer}
        onRefresh={fetchData}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: 20,
  },
  footer: {
    marginTop: 20,
    marginBottom: 20,
  },
});
