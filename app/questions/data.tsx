import { getDatabase, ref, set } from "firebase/database";
import { User } from "@/lib/types";

export function writeUserData(user_data: User) {
  const db = getDatabase();
  set(ref(db, `users/${user_data.userId}`), user_data)
    .then(() => {
      console.log("Data successfully written!");
    })
    .catch((error) => {
      console.error("Error writing data:", error);
    });
}

// validation functions

export function check_date() {}

//export function check_canvas_token(canvas_token) {}

// firebase db functions
