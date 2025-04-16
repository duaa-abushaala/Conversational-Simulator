import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
// SplashScreen is the initial screen shown when the app starts.
// It displays the app title, a loading animation, and navigates to the Login screen after a 3 secs
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // Navigate after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversational Simulator</Text>


      <LottieView
        source={require("../assets/animations/loading.json")}  // Displays loading dots in splash
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.tagline}>Practice Conversations with Confidence</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  tagline: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default SplashScreen;
