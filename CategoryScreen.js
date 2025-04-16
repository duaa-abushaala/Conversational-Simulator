import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { getUserPoints, updateUserPoints } from "./pointsService"; // Import points functions
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Markdown from "react-native-markdown-display";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

// Shows theory content and intergrated quizzes. Further, awards points
const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [content, setContent] = useState([]); // Page content from Firestore
  const [loading, setLoading] = useState(true); // Loading indicator
  const [pageIndex, setPageIndex] = useState(0);// Current page idnex
  const [selectedOption, setSelectedOption] = useState(null); // Selected Quiz Option
  const [isCorrect, setIsCorrect] = useState(null); // Boolean for quiz result
  const [points, setPoints] = useState(0); // User points
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSwipeAnimation, setShowSwipeAnimation] = useState(true);

  // Fetches content and points from Firestore
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(firestore, "theoryContent", category.title);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const rawContent = docSnap.data().content || [];
          const formattedContent = rawContent.map((item) => ({
            ...item,
            content: item.content ? item.content.replace(/\\n/g, "\n") : "",
          }));
          setContent(formattedContent);
        } else {
          console.log("No content yet for this category.");
        }

        // Fetch user points
        const userPoints = await getUserPoints();
        setPoints(userPoints);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [category]);

  // Handles swiping between pages
  const handleGesture = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -50 && pageIndex < content.length - 1) {
        setPageIndex(pageIndex + 1);
        resetQuiz();

        // Hide swipe animation after first page
        if (pageIndex === 0) {
          setShowSwipeAnimation(false);
        }
      } else if (nativeEvent.translationX > 50 && pageIndex > 0) {
        setPageIndex(pageIndex - 1);
        resetQuiz();
      }
    }
  };

  // Resets quiz selection on page change
  const resetQuiz = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionSelect = async (option) => {
    const correctAnswer = content[pageIndex]?.quiz?.correctAnswer;
    setSelectedOption(option);

    if (option === correctAnswer) {
      setIsCorrect(true);

      // Trigger confetti animation
      setShowConfetti(false);
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }, 100);

      // Update user points
      const updatedPoints = await updateUserPoints(10);
      if (updatedPoints !== undefined) {
        setPoints(updatedPoints);
      }
    } else {
      setIsCorrect(false);
    }
  };

  // shows loading indicator while fetching content 
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  const currentPage = content[pageIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#F39C12" />
      </TouchableOpacity>

      <Text style={styles.title}>{category.title}</Text>

      <Text style={styles.pointsText}>⭐ {points}</Text>

      {showConfetti && (
        <LottieView
          source={require("../assets/confetti.json")}
          autoPlay
          loop={false}
          style={styles.confettiAnimation}
        />
      )}

      {showSwipeAnimation && pageIndex === 0 && (
        <LottieView
          source={require("../assets/swipe.json")}
          autoPlay
          loop
          style={styles.swipeAnimation}
        />
      )}

      {/* Main theory content and quiz card */}

      <PanGestureHandler onHandlerStateChange={handleGesture}>
        <View style={styles.card}>
          {currentPage?.content && (
            <>
              <Text style={styles.heading}>{currentPage.heading || "No Heading"}</Text>
              <Markdown style={markdownStyles}>{currentPage.content}</Markdown>
            </>
          )}

          {/* Quiz Section */}
          {currentPage?.quiz && (
            <>
              <Text style={styles.heading}>{currentPage.quiz.question}</Text>
              {currentPage.quiz.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              {selectedOption !== null && (
                <Text
                  style={[
                    styles.feedbackText,
                    isCorrect ? styles.correctText : styles.incorrectText,
                  ]}
                >
                  {isCorrect ? "🎉 Correct! Well done!" : "❌ Incorrect. Try Again."}
                </Text>
              )}
            </>
          )}
        </View>
      </PanGestureHandler>

      {/* Pagination Dots */}
      {content.length > 1 && (
        <View style={styles.paginationContainer}>
          {content.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                pageIndex === index && styles.activeDot, // Highlights current page
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF4E3",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF4E3",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F39C12",
    marginBottom: 10,
    textAlign: "center",
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27AE60",
    marginBottom: 10,
  },
  card: {
    width: "90%",
    height: "70%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  confettiAnimation: {
    position: "absolute",
    top: 0,
    width: 300,
    height: 300,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F39C12",
    marginBottom: 15,
  },
  optionButton: {
    width: "100%",
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: "#F39C12",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#FFA500",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 18,
  },
  correctText: {
    color: "green",
  },
  incorrectText: {
    color: "red",
  },
  swipeAnimation: {
    position: "absolute",
    bottom: 80, 
    width: 250,
    height: 150,
    right: 30,
    alignSelf: "centre",
    zIndex: 10,
    backgroundColor: "transparent",
  },
  paginationContainer: {
    flexDirection: "row",
    flexWrap: "wrap", 
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 30,  
    width: "90%", 
  },
  
  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#bbb",
    marginHorizontal: 4,
    marginBottom: 5, 
    opacity: 0.5,
  },
  
  activeDot: {
    backgroundColor: "#F39C12",
    width: 8,
    height: 8,
    opacity: 1,
  },
  
});

const markdownStyles = {
  body: {
    fontSize: 18,
    color: "#444",
    lineHeight: 28,
    textAlign: "justify",
  },
  heading1: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 15,
  },
  heading2: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  heading3: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 15,
  },
};

export default CategoryScreen;
