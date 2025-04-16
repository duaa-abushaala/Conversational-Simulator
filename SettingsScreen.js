import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase"; // Adjust path to firebase.js file
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import necessary methods from Firebase

// SettingsSreen shows the users eail address, allows for logout or back to main menu
const SettingsScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current user's email on component mount using onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set email if logged in
      } else {
        // Navigate to login screen if no user is logged in
        navigation.replace("Login");
      }
      setLoading(false);
    });

    // Cleanup listener when unmounting
    return () => unsubscribe();
  }, [navigation]);

  // Sign out the user and navigate back login
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Successfully logged out, navigate to login screen
        navigation.replace("Login");
      })
      .catch((error) => {
        console.error("Error during logout: ", error);
      });
  };

  // If the page is loading, show a loading spinner while data is fetched
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      {/* Go Back button */}
      
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()} // back to the previous screen
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: "#333",
  },
  email: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
  },
  button: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  goBackButton: {
    backgroundColor: "#9E9E9E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
});

export default SettingsScreen;

