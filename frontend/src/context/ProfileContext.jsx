import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Components/pages/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false); // true = has MongoDB profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // No Firebase user — clear everything and stop loading
        setProfile(null);
        setProfileExists(false);
        setLoading(false);
        return;
      }

      // Always set a minimal profile from Firebase immediately
      // so components never get null while waiting for the DB fetch
      setProfile({
        name:  user.displayName || "",
        email: user.email       || "",
        profileImage: user.photoURL || "",
      });

      try {
        const res = await fetch(`/profile?email=${encodeURIComponent(user.email)}`);

        if (res.ok) {
          // User has a full MongoDB profile
          const profileData = await res.json();
          setProfile({ ...profileData, email: user.email });
          setProfileExists(true);
        } else if (res.status === 404) {
          // Brand new user — profile doesn't exist yet. This is NOT an error.
          // Keep the minimal Firebase profile and flag as not yet set up.
          setProfileExists(false);
        } else {
          console.warn("Unexpected profile fetch status:", res.status);
          setProfileExists(false);
        }
      } catch (err) {
        // Network error — don't crash, just keep Firebase profile
        console.error("Profile fetch error:", err);
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, profileExists, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};
