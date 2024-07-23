import { ActivityIndicator, StyleSheet, View } from "react-native";
import LoginScreen from "./apps/screens/LoginScreen";
import * as SecureStore from "expo-secure-store";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  ClerkLoaded,
} from "@clerk/clerk-expo";

import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from "@env";
import TabNavigation from "./apps/navigations/TabNavigation";
import { useEffect, useState } from "react";

export default function App() {
  return (
    <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <View className="flex-1 bg-white">
          <SignedIn>
            <TabNavigation />
          </SignedIn>
          <SignedOut>
            <LoginScreen />
          </SignedOut>
        </View>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

/* function LoadingIndicator() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
} */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
