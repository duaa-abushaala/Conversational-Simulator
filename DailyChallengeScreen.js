import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Animated
} from "react-native";
import { firestore, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// DailyChallengesScreen shows the user their daily task, tracks completion, and awards points.
const DailyChallengesScreen = ({ navigation }) => {
  const [challenge, setChallenge] = useState(null); // State for challenge data
  const [loading, setLoading] = useState(true); // state for loading indicator
  const [totalPoints, setTotalPoints] = useState(0);// state for total user points
  const scaleAnim = new Animated.Value(1);

  // Fetch challenge on first load
  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserPoints();
    }, [])
  );

// Fetch the current day's challenge and checks completion status
  const fetchDailyChallenge = async () => {
    try {
      console.log("Fetching daily challenge...");

      const docRef = doc(firestore, "dailyChallenges", "today");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("No daily challenge document found!");
        return;
      }

      let data = docSnap.data();

      if (!data.challenges || !Array.isArray(data.challenges) || data.challenges.length === 0) {
        console.error("⚠️ Challenges array is missing or empty.");
        return;
      }

      // Select challeneg by index
      const selectedChallenge = data.challenges[data.currentIndex];
      let userHasCompleted = false;

      // Checks if ser has completed current challenge
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef, { source: "server" });

        if (userSnap.exists()) {
          const completedChallenges = userSnap.data().dailyChallenges || {};
          userHasCompleted = completedChallenges[selectedChallenge.id] || false;
        }
      }

      setChallenge({ ...selectedChallenge, userHasCompleted });
    } catch (error) {
      console.error("Error fetching daily challenge:", error.message);
    } finally {
      setLoading(false);
    }
  };

   // Fetches users current points from Firestore
  const fetchUserPoints = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
  
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef, { source: "server" });
  
      if (userSnap.exists()) {
        let userData = userSnap.data();
        let userPoints = userData.points ?? 0; 
  
        console.log("Fetched User Points from Firestore:", userPoints);
        setTotalPoints(userPoints);
      } else {
        await updateDoc(userRef, { points: 0 }); // creates new record with 0 points if doesnt exist
        setTotalPoints(0);
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
    }
  };
  
// Mark challenge as completed and update user points
  const completeChallenge = async () => {
    if (!challenge) {
      console.error("No challenge to complete.");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
  
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef, { source: "server" });
  
      if (!userSnap.exists()) {
        console.error("User document not found.");
        return;
      }
  
      let userData = userSnap.data();
      let completedChallenges = userData.dailyChallenges || {};
  
      // Marks this challenge as complete
      completedChallenges[challenge.id] = true;
  
      const pointsEarned = 10;
      const currentPoints = userData.points ?? 0;
      const newTotalPoints = currentPoints + pointsEarned;
  
      //update record in Firestore
      await updateDoc(userRef, {
        dailyChallenges: completedChallenges,
        points: newTotalPoints, 
      });
  
      //uodates state to show completion
      setChallenge((prevChallenge) => ({
        ...prevChallenge,
        userHasCompleted: true,
      }));
  
      setTotalPoints(newTotalPoints);
    } catch (error) {
      console.error("Error completing challenge:", error);
    }
  };
 // Loading spinner while data is fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F39C12" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={32} color="#F39C12" />
      </TouchableOpacity>

      <Text style={styles.header}>Today's Challenge</Text>

      {challenge ? (
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>

          {challenge.userHasCompleted ? (
            <Text style={styles.completedText}>🎉 Challenge Completed!</Text>
          ) : (
            <TouchableOpacity style={styles.completeButton} onPress={completeChallenge}>
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={styles.noChallengesText}>No challenge available today.</Text>
      )}

      <Image source={require("../assets/dailyChallenge.png")} style={styles.image} />

      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>⭐ {totalPoints} points</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF4E3",
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F39C12",
    textAlign: "center",
    marginBottom: 20,
  },
  challengeCard: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 18,
    width: "90%", 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  challengeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  challengeDescription: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  completeButton: {
    backgroundColor: "#F39C12",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: "80%", 
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  completedText: {
    fontSize: 20,
    color: "#27AE60",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  pointsContainer: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  pointsText: {
    fontSize: 20, 
    fontWeight: "bold",
    color: "#444",
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 10,
    resizeMode: "contain",
  },
});

export default DailyChallengesScreen;
