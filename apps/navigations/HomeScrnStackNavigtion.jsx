import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CategoryList from "../screens/CategoryList";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import AllCategories from "../screens/AllCategories";

const Stack = createStackNavigator();

export default function HomeScrnStackNavigtion() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="category-list"
        component={CategoryList}
        options={({ route }) => ({
          title: route.params.category,
          headerStyle: {
            backgroundColor: "#3B92F6",
          },
          headerTintColor: "#fff",
        })}
      />
      <Stack.Screen
        name="product-detail"
        component={ProductDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: "#3B92F6",
          },
          headerTintColor: "#fff",
          headerTitle: "Detail",
        }}
      />
      <Stack.Screen
        name="allcategories"
        component={AllCategories}
        options={{
          headerStyle: {
            backgroundColor: "#3B92F6",
          },
          headerTintColor: "#fff",
          headerTitle: "All Categories",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
