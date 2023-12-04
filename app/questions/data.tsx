import { getDatabase, ref, set } from "firebase/database";
import { User } from "@/lib/types";
import logger from "@/lib/logger";

export function writeUserData(user_data: User) {
  const db = getDatabase();
  set(ref(db, `users/${user_data?.userId}`), user_data)
    .then(() => {
      logger.info("Data successfully written!");
    })
    .catch((error) => {
      logger.error("Error writing data:", error);
    });
}

// validation functions

// export function check_date() {}

// export async function validateCanvasToken(canvasToken: string): Promise<boolean> {
//   try {
//     const response = await fetch('CANVAS_API_ENDPOINT', {
//       headers: { 'Authorization': `Bearer ${canvasToken}` }
//     });
//     return response.ok; // Returns true if status code is 200-299
//   } catch (error) {
//     logger.error("Error validating Canvas token:", error);
//     return false;
//   }
// }

// firebase db functions
