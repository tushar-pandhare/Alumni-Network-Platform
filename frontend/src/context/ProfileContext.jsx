import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Components/pages/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(
            `http://localhost:5000/profile?email=${user.email}`
          );
          if (res.ok) {
            const profileData = await res.json();
            setProfile({ ...profileData, email: user.email });
          } else {
            setProfile({
              name: user.displayName || "",
              email: user.email || "",
            }); // fallback for unregistered users
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};
