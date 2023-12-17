// Type definitions for Canvas API
export type UserProfile = {
  _id?: string
  id: number
  name: string
  sortable_name: string
  avatar_url: string
  bio: string
  primary_email: string
  login_id: string
  courses: string[]
  apiKey_hashed: string
  refreshToken: string
  isOnboarded: boolean
}

export type Department = {
  course_code: string
  department: string
}

export type Course = {
  _id: string
  course_title: string
  course_description: string
  course_credits: string
  course_prereqs: string[]
  course_offered_in: string[]
  course_code: string
  course_level: string
  course_rating: number
  course_professors: [{ display_name: string; avatar_image_url: string }] | []
  course_syllabus: string
  currently_enrolled: string[]
  previously_enrolled: string[]
  stevens_course_link: string
  department_code: string
  department: string
  download_size: number
}

export type User = {
  name: string
  userId: string
  email: string
  major: string
  joiningTerm: string
  graduationDate: string
  canvasToken_hashed: string
  phone_number: string
  photo_url: string
  metadata: object
  courses: string[]
}

export type UserWithAuth = User & {
  isAuthenticated: boolean
  lastSignedIn: string
}
