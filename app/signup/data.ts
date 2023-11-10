import { db, app } from "@/firebase";
import { getAuth } from "firebase/auth";
import { redirect } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const auth = getAuth(app);

//create user with plain email and password
export const create_plain_user = async (email: string, password: string) => {
  try {
    if (!email.endsWith("stevens.edu")) {
      throw "Must use a Stevens college ID only";
    }
    const created_user = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (e) {
    console.log(e);
  }
};
// plain email and password login
export const loginEmailPassword = async (email: string, password: string) => {
  try {
    const user_credentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(user_credentials);
  } catch (e) {
    console.log(e);
  }
};

//Logout function
export const logout = async () => {
  await signOut(auth);
};

//monitor user state(whether he is logged in or not)
export const monitor_login_state = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  });
};

export const google_sign_in = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const data = await signInWithPopup(auth, provider);
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};
