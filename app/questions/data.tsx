import { getDatabase, ref, set } from "firebase/database";

export function writeUserData(
  userId,
  name,
  email,
  major,
  joiningTerm,
  graduationDate,
  canvasToken,
  phone_number,
  photo_url,
  creation_time
) {
  const db = getDatabase();
  set(ref(db, `users/${userId}`), {
    username: name,
    email: email,
    major: major,
    joiningTerm: joiningTerm,
    graduationDate: graduationDate,
    canvasToken: canvasToken,
    phone_number: phone_number,
    photo_url: photo_url,
    creation_time: creation_time
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

export function check_canvas_token(canvas_token) {}

// firebase db functions
