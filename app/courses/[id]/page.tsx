import { getCourseById } from "../data";

// fix this shit 
// const CourseDetail1 = async ({ params }) => {
//   const { id } = params;

//   const course = await getCourseById(id);
//   return (
//     <div>
//       <div className="px-4 sm:px-0">
//         <h3 className="text-4xl font-semibold leading-7">
//           {course?.course_code} - {course?.course_name}
//         </h3>
//         <p className="mt-1 max-w-2xl text-sm leading-6">Course Description</p>
//       </div>
//       <div className="mt-6 border-t border-gray-100 dark:border-slate-600">
//         <dl className="divide-y divide-gray-100 dark:divide-slate-700">
//           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//             <dt className="text-sm font-medium leading-6 ">Professor Name</dt>
//             <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
//               {course?.professor}
//             </dd>
//           </div>
//           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//             <dt className="text-sm font-medium leading-6 ">Email address</dt>
//             <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
//               {course?.professor_email}
//             </dd>
//           </div>
//           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//             <dt className="text-sm font-medium leading-6 ">Semester Offered</dt>
//             <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
//               {course?.semester.map((semester) => (
//                 <span className="mr-4" key={semester}>
//                   {semester}
//                 </span>
//               ))}
//             </dd>
//           </div>
//           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//             <dt className="text-sm font-medium leading-6 ">Course Rating</dt>
//             <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
//               {course?.rating} / 5
//             </dd>
//           </div>
//           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//             <dt className="text-sm font-medium leading-6 ">
//               Students Enrolled
//             </dt>
//             <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
//               Dhruv Vaghela, Yuvaraj Nagi, Sanjeet Jain, Yash Baleri
//             </dd>
//           </div>
//           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//             <dt className="text-sm font-medium leading-6 ">
//               What will you learn
//             </dt>
//             <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
//               Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
//               incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
//               consequat sint. Sit id mollit nulla mollit nostrud in ea officia
//               proident. Irure nostrud pariatur mollit ad adipisicing
//               reprehenderit deserunt qui eu.
//             </dd>
//           </div>
//           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//             <dt className="text-sm font-medium leading-6 ">Syllabus</dt>
//             <dd className="mt-2 text-sm  sm:col-span-2 sm:mt-0">
//               <ul
//                 role="list"
//                 className="divide-y divide-gray-100 rounded-md border border-gray-200"
//               >
//                 <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
//                   <div className="flex w-0 flex-1 items-center">
//                     <div className="ml-4 flex min-w-0 flex-1 gap-2">
//                       <span className="truncate font-medium">
//                         CS590_Syllabus.pdf
//                       </span>
//                       <span className="flex-shrink-0 text-gray-400">2.4mb</span>
//                     </div>
//                   </div>
//                   <div className="ml-4 flex-shrink-0">
//                     <a
//                       href="#"
//                       className="font-medium hover:text-indigo-500 flex"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="lucide lucide-arrow-down-to-line"
//                       >
//                         <path d="M12 17V3" />
//                         <path d="m6 11 6 6 6-6" />
//                         <path d="M19 21H5" />
//                       </svg>
//                       Download
//                     </a>
//                   </div>
//                 </li>
//               </ul>
//             </dd>
//           </div>
//         </dl>
//       </div>
//     </div>
//   );
// };


const CourseDetail = async () => {
  return (<div>test</div>)

}
export default CourseDetail;
