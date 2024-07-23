import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyProductScreen from "../screens/MyProductScreen";
import Profile from "../screens/Profile";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createStackNavigator();
export default function ProfileStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="profile-tab"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="my-product"
        component={MyProductScreen}
        options={{
          headerTitle: "My Products",
          headerStyle: {
            backgroundColor: "#3B92F6",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="product-detail"
        component={ProductDetailScreen}
        options={{
          headerTitle: "Product Detail",
          headerStyle: {
            backgroundColor: "#3B92F6",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
