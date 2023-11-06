type Department = {
  course_code: string;
  department: string;
};

export type Course = {
  _id: string;
  course_title: string;
  course_description: string;
  course_credits: string;
  course_prereqs: string[];
  course_offered_in: string[];
  course_code: string;
  course_level: string;
  course_rating: number;
  course_professors: string[];
  course_syllabus: string;
  currently_enrolled: string[];
  previous_enrolled: string[];
  stevens_course_link: string;
  department_code: string;
  department: string;
};
