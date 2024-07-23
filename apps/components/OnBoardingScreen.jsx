// apps/screens/OnboardingScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const OnboardingScreen = ({ onFinish }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App!</Text>
      <Button title="Get Started" onPress={onFinish} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default OnboardingScreen;
