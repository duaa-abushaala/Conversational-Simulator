import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

// Function to get user points
export const getUserPoints = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return 0;

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    return userSnap.exists() ? userSnap.data().points || 0 : 0;
  } catch (error) {
    console.error("Error fetching points:", error);
    return 0;
  }
};

// Function to update user points
export const updateUserPoints = async (earnedPoints) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let newPoints = earnedPoints;

    if (userSnap.exists()) {
      newPoints += userSnap.data().points || 0;
    } else {
      // If the document does not exist, create it
      await setDoc(userRef, { uid: user.uid, points: newPoints, completedModules: [], dailyChallenges: {} }, { merge: true });
    }

    // Now update the points field
    await updateDoc(userRef, { points: newPoints });

    return newPoints;
  } catch (error) {
    console.error("Error updating points:", error);
    return 0;
  }
};
