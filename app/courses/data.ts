import { db } from "@/firebase";

import { doc, collection, getDoc, getDocs } from "firebase/firestore";

export const getAllCourses = async () => {
  const allCourses: any = [];
  const collectionRef = collection(db, "courses")
  const querySnapshot = await getDocs(collectionRef);
  querySnapshot.forEach((doc) => {
    allCourses.push({ id: doc.id, ...doc.data() });
  });

  return allCourses;
}

export const getCourseById = async (id: string) => {
  const docRef = doc(db, "courses", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log(`No such document with id ${id}!`)
    return null;
  }

}
