// Type definitions for Canvas API
export type UserProfile = {
  _id: string;
  id: number;
  name: string;
  sortable_name: string;
  avatar_url: string;
  bio: string;
  primary_email: string;
  login_id: string;
};

export type CourseApiReturn = {
  id: number;
  name: string;
  account_id: number;
  uuid: string;
  start_at: string | null;
  grading_standard_id: number | null;
  is_public: boolean;
  created_at: string;
  course_code: string;
  default_view: string;
  root_account_id: number;
  enrollment_term_id: number;
  license: string;
  grade_passback_setting: number | null;
  end_at: string | null;
  public_syllabus: boolean;
  public_syllabus_to_auth: boolean;
  storage_quota_mb: number;
  is_public_to_auth_users: boolean;
  homeroom_course: boolean;
  course_color: string | null;
  friendly_name: string | null;
  term: {
    id: number;
    name: string;
    start_at: string;
    end_at: string;
    created_at: string;
    workflow_state: string;
    grading_period_group_id: number | null;
  };
  apply_assignment_group_weights: boolean;
  teachers: [
    {
      id: number;
      anonymous_id: string;
      display_name: string;
      avatar_image_url: string;
      html_url: string;
      pronouns: string | null;
    }
  ];
  calendar: {
    ics: string;
  };
  time_zone: string;
  blueprint: boolean;
  template: boolean;
  enrollments: [
    {
      type: string;
      role: string;
      role_id: number;
      user_id: number;
      enrollment_state: string;
      limit_privileges_to_course_section: boolean;
    }
  ];
  hide_final_grades: boolean;
  workflow_state: string;
  restrict_enrollments_to_course_dates: boolean;
};
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