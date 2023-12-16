import { db } from "@/firebase"
import logger from "@/lib/logger"

import { doc, collection, getDoc, getDocs } from "firebase/firestore"
import { courses as courseColleciton } from "@/config/mongo/mongoCollections"

export const getAllCourses = async (isMongo: boolean) => {
  let allCourses: any = []
  if (isMongo) {
    const courses = await courseColleciton()
    allCourses = await courses.find({}).toArray()
  } else {
    const collectionRef = collection(db, "courses")
    const querySnapshot = await getDocs(collectionRef)
    querySnapshot.forEach((doc) => {
      allCourses.push({ id: doc.id, ...doc.data() })
    })
  }
  return allCourses
}

export const getCourseById = async (id: string, isMongo: boolean = true) => {
  if (isMongo) {
    const courses = await courseColleciton()
    const course = await courses.findOne({ _id: id })
    return course
  } else {
    const docRef = doc(db, "courses", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      logger.error(`No such document with id ${id}!`)
      return null
    }
  }
}
export const getCourseByCode = async (course_code: string) => {
  const courses = await courseColleciton()
  const course = await courses.findOne({ course_code: course_code })
  return course
}

export const getCourseByDept = async (department_code: string) => {
  const courses = await courseColleciton()
  const course = await courses
    .find({ department_code: department_code.toUpperCase() })
    .toArray()
  return course
}
