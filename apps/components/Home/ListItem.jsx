import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ListPostItem from "./ListPostItem";

export default function ListItem({
  latestPosts,
  heading,
  fetchPosts,
  loading,
}) {
  // const [loading, setLoading] = useState(false);
  return (
    <View className="mt-2">
      <Text className="font-bold text-[18px] ml-2">{heading}</Text>
      <FlatList
        data={latestPosts}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item, index }) => <ListPostItem item={item} />}
        onRefresh={fetchPosts}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
