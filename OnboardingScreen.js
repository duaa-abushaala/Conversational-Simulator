import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import Animated, { Easing, withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";

// Get screen dimensions for slides
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Data structure for onboarding slides
const slides = [
  {
    title: "Struggle with Conversations?",
    description: "Whether it's small talk, networking, or public speaking, social interactions can be daunting. But you can improve!",
    backgroundColor: "#D8A7B1",
    animation: require("../assets/animations/conversation.json"),
  },
  {
    title: "Your Personal Social Coach",
    description: "This app is designed to help you build confidence, improve communication skills, and connect with others effectively.",
    backgroundColor: "#D4CBE5",
    animation: require("../assets/animations/social_coach.json"),
  },
  {
    title: "Learn & Apply",
    description: "Gain insights from structured lessons on small talk, body language, conflict resolution, and more. Then, put your knowledge into practice!",
    backgroundColor: "#C3B1E1",
    animation: require("../assets/animations/learning.json"),
  },
  {
    title: "Daily Challenges & Progress Tracking",
    description: "Reinforce your learning with interactive exercises and track your improvement as you earn points and unlock badges.",
    backgroundColor: "#B0A999",
    animation: require("../assets/animations/progress_tracking.json"),
  },
  {
    title: "Transform Your Conversations",
    description: "Start your journey today and become a confident, effective communicator in any situation!",
    backgroundColor: "#A49393",
    animation: require("../assets/animations/success.json"),
  },
];

// OnboardingScreen introduces app through animafed slides and guides users to main menu
const OnboardingScreen = ({ navigation }) => {
  const translateX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to move to the next slide
  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Animate the carousel when currentIndex changes.
  useEffect(() => {
    translateX.value = withTiming(-currentIndex * screenWidth, {
      duration: 500,
      easing: Easing.ease,
    });
  }, [currentIndex]);

  // Auto-slides every 4 seconds (except last slide)
  useEffect(() => {
    if (currentIndex < slides.length - 1) {
      const interval = setInterval(() => {
        goToNextSlide();
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [currentIndex]);

  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Renders a single slide
  const renderSlide = (slide, index) => (
    <View style={[styles.slide, { backgroundColor: slide.backgroundColor }]} key={index}>
      <LottieView source={slide.animation} autoPlay loop style={styles.animation} />
      <Text style={styles.title}>{slide.title}</Text>
      {slide.description && <Text style={styles.description}>{slide.description}</Text>}
    </View>
  );

  // Skip button - Navigate straight to the main menu
  const handleSkip = () => {
    navigation.replace("MainMenu");
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.carouselContainer, slideAnimatedStyle]}>
        {slides.map((slide, index) => renderSlide(slide, index))}
      </Animated.View>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>

      {currentIndex === slides.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("MainMenu")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  carouselContainer: {
    flexDirection: "row",
    width: screenWidth,
    height: screenHeight,
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  animation: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  button: {
    backgroundColor: "#D3D3D3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 50,
    position: "absolute",
    bottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    padding: 10,
    borderRadius: 10,
  },
});
