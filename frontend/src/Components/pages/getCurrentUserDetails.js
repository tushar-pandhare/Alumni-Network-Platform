// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "./firebase";

// export const getCurrentUserDetails = async () => {
//   const user = auth.currentUser;
//   if (user) {
//     const docRef = doc(db, "users", user.uid);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       return {
//         name: data.name || " ",
//         email: user.email,
//       };
//     }
//   }
//   return { name: "", email: "" };
// };
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";


export const getCurrentUserDetails = async () => {
  const user = auth.currentUser;
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name || "",
        email: user.email
      };
    }
  }
  return { name: "", email: "" };
};

