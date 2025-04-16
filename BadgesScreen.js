import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { getUserPoints, updateUserPoints } from "./pointsService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCommentDots, faUsers, faComments, faMicrophone, faHandshake, faBook, faTrophy, faMedal, faRocket, faBrain } from "@fortawesome/free-solid-svg-icons";

// List of badges with name, target points, and icons
const badges = [
    { id: 1, name: "Conversationalist", points: 30, icon: faCommentDots },
    { id: 2, name: "Social Butterfly", points: 40, icon: faUsers },
    { id: 3, name: "Discussion Master", points: 70, icon: faComments },
    { id: 4, name: "Public Speaker", points: 100, icon: faMicrophone },
    { id: 5, name: "Networking Pro", points: 110, icon: faHandshake },
];

// Get screen width to determine layout dimensions
const { width } = Dimensions.get("window");

// Badge screen dispplays which badge a user has unlocked based on their points
const BadgesScreen = ({ navigation }) => {
  const [points, setPoints] = useState(0); // Holds users total points

  // Fetches user points
  useEffect(() => {
    const fetchPoints = async () => {
      const userPoints = await getUserPoints();
      setPoints(userPoints);
    };
    fetchPoints();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#F39C12" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Badges</Text>
      <Text style={styles.points}>⭐ {points} Points</Text>

      <FlatList
        data={badges}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        renderItem={({ item }) => {
          const unlocked = points >= item.points; // Badge is unl

          return (
            <View style={[styles.badgeCard, unlocked ? styles.unlockedBadge : styles.lockedBadge]}>
              <FontAwesomeIcon 
                icon={item.icon} 
                size={40} 
                color={unlocked ? "#FFD700" : "#B0B0B0"} // Gold if unlocked, grey if locked
              />
              <Text style={[styles.badgeText, unlocked ? styles.unlockedText : styles.lockedText]}>
                {item.name}
              </Text>
              <Text style={styles.unlockText}>
                {unlocked ? "Unlocked 🎉" : `Unlock at ${item.points} points`}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

// Styling

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF4E3",
    paddingTop: 60,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F39C12",
    marginBottom: 10,
  },
  points: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27AE60",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 50,
    alignItems: "center",
  },
  badgeCard: {
    width: (width / 2) - 30,
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    margin: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  lockedBadge: {
    backgroundColor: "#E0E0E0", 
  },
  unlockedBadge: {
    backgroundColor: "#FFFACD", 
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  lockedText: {
    color: "#777",
  },
  unlockedText: {
    color: "#DAA520", 
  },
  unlockText: {
    fontSize: 12,
    marginTop: 5,
    color: "#555",
    textAlign: "center",
  },
});

export default BadgesScreen;
