import 'react-native-gesture-handler';
import React, { useEffect } from "react";
import { registerRootComponent } from 'expo';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CategoryScreen from "./screens/CategoryScreen";
import DailyChallengesScreen from './screens/DailyChallengeScreen';
import BadgesScreen from './screens/BadgesScreen';
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import moment from "moment";
import { firestore } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Stack = createStackNavigator();
const DAILY_REFRESH_TASK = "daily-refresh-task";

// Defining the background task
TaskManager.defineTask(DAILY_REFRESH_TASK, async () => {
  console.log("refresh daily challenge...");
  try {
    const docRef = doc(firestore, "dailyChallenges", "today");
    const docSnap = await getDoc(docRef);
    const today = moment().format("YYYY-MM-DD");

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.lastUpdated !== today) {
        const nextIndex = (data.currentIndex + 1) % data.challenges.length;
        await updateDoc(docRef, {
          currentIndex: nextIndex,
          lastUpdated: today,
        });
        console.log(`Daily challenge updated to index ${nextIndex}.`);
      } else {
        console.log("Daily challenge is already up-to-date.");
      }
    } else {
      console.error("No document found for 'today'.");
    }
  } catch (error) {
    console.error("Error updating daily challenge:", error);
  }

  return BackgroundFetch.Result.NewData;
});

// Function to register the background fetch task
const registerBackgroundFetch = async () => {
  const status = await BackgroundFetch.getStatusAsync();

  if (status === BackgroundFetch.Status.Available) {
    try {
      await BackgroundFetch.registerTaskAsync(DAILY_REFRESH_TASK, {
        minimumInterval: 86400, // Run once every 24 hours
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Background task registered successfully.");
    } catch (err) {
      console.error("Failed to register background task:", err);
    }
  } else {
    console.error("Background fetch is not available or supported.");
  }
};

// Main App Component
const App = () => {
  useEffect(() => {
    registerBackgroundFetch(); // Register background fetch on app load
  }, []); // Run once when the app starts

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="DailyChallenge" component={DailyChallengesScreen} />
        <Stack.Screen name="Badges" component={BadgesScreen} />    
          
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
