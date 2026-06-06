import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Gets the current Firebase user's name and email.
 * Falls back to empty strings if not found.
 */
export const getCurrentUserDetails = async () => {
  const user = auth.currentUser;
  if (!user) return { name: "", email: "" };

  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name:  data.fullname || data.name || user.displayName || "",
        email: user.email,
        role:  data.role || "",
      };
    }
  } catch (err) {
    console.error("getCurrentUserDetails error:", err);
  }

  return {
    name:  user.displayName || "",
    email: user.email,
    role:  "",
  };
};
