import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Explore from "../screens/Explore";
import AddPost from "../screens/AddPost";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import HomeScrnStackNavigtion from "./HomeScrnStackNavigtion";
import ExploreScrnStackNav from "./ExploreScrnStackNav";
import ProfileStackNav from "./ProfileStackNav";

const Tab = createBottomTabNavigator();
export default function TabNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home-nav"
          component={HomeScrnStackNavigtion}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                Home
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScrnStackNav}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                Explore
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="explore" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AddPost"
          component={AddPost}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                Add Post
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="post-add" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackNav}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
                Profile
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-circle-o" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
