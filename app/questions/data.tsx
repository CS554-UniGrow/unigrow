import { getDatabase, ref, set } from "firebase/database";

export function writeUserData(
  userId,
  name,
  email,
  major,
  joiningTerm,
  graduationDate,
  canvasToken
) {
  const db = getDatabase();
  set(ref(db, `users/${userId}`), {
    username: name,
    email: email,
    major: major,
    joiningTerm: joiningTerm,
    graduationDate: graduationDate,
    canvasToken: canvasToken
  })
    .then(() => {
      console.log("Data successfully written!");
    })
    .catch((error) => {
      console.error("Error writing data:", error);
    });
}

// validation functions

export function check_date() {}

export function check_canvas_token() {}

// firebase db functions
