import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductDetailScreen from "../screens/ProductDetailScreen";
import Explore from "../screens/Explore";

const Stack = createStackNavigator();

export default function ExploreScrnStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="explore-screen"
        component={Explore}
        options={{ headerShown: false }}
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
