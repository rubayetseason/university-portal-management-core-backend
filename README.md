# University Portal Management System Core Functionality Service

This is the documentation for the Core Service component of the University Portal Management System. The Core Service provides enrollment, payment and other crucial functionalities for the three main roles in the system: Admin, Student, and Faculty. It is built using Prisma, PostgreSQL, TypeScript, Express.js, and Zod validation.

## Live website link

[Live base API link](https://university-auth-backend-sandy.vercel.app/)
[https://university-auth-backend-sandy.vercel.app/](https://university-auth-backend-sandy.vercel.app/)

## Functional Requirements

### Student

- Student can enroll into course
- Student can start semester registration
- Student can get their marks and CGPA
- Student can choose their desired faculty, room, building, time
- Student can manage and update their profile
- Student can complete their payment (full / partial)

### Admin

- Admin can manage and update students and faculties
- Admin can create and manage academic departments, semesters, faculty, building, course, registration
- Admin can manage student payment
- Admin can manage registration

### Faculty

- Faculty can evaluate students with marks and CGPA
- Faculty can check and manage student academic results

## API Endpoints

### Student

- `GET api/v1/student`
- `GET api/v1/student/my-courses`
- `GET api/v1/student/my-course-schedule`
- `GET api/v1/student/my-academic-info`
- `GET api/v1/student/:id`
- `POST api/v1/student`
- `PATCH api/v1/student/:id`
- `DELETE api/v1/student/:id`

### Faculty

- `GET api/v1/faculty`
- `GET api/v1/faculty/my-courses`
- `GET api/v1/faculty/my-course-students`
- `GET api/v1/faculty/:id`
- `POST api/v1/faculty`
- `POST api/v1/faculty/:id/assign-courses`
- `PATCH api/v1/faculty/:id`
- `DELETE api/v1/faculty/:id`
- `DELETE api/v1/faculty/:id/remove-courses`

### Academic Department

- `GET api/v1/academic-department`
- `GET api/v1/academic-department/:id`
- `POST api/v1/academic-department`
- `PATCH api/v1/academic-department/:id`
- `DELETE api/v1/academic-department/:id`

### Academic Faculty

- `GET api/v1/academic-faculty`
- `GET api/v1/academic-faculty/:id`
- `POST api/v1/academic-faculty`
- `PATCH api/v1/academic-faculty/:id`
- `DELETE api/v1/academic-faculty/:id`

### Academic Semester

- `GET api/v1/academic-semester`
- `GET api/v1/academic-semester/:id`
- `POST api/v1/academic-semester`
- `PATCH api/v1/academic-semester/:id`
- `DELETE api/v1/academic-semester/:id`

### Building

- `GET api/v1/building`
- `GET api/v1/building`
- `GET api/v1/building/:id`
- `POST api/v1/building`
- `PATCH api/v1/building/:id`
- `DELETE api/v1/building/:id`

### Room

- `GET api/v1/room`
- `GET api/v1/room/:id`
- `POST api/v1/room`
- `PATCH api/v1/room/:id`
- `DELETE api/v1/room/:id`

### Course

- `GET api/v1/course`
- `GET api/v1/course/:id`
- `POST api/v1/course`
- `POST api/v1/course/:id/assign-faculties`
- `PATCH api/v1/course/:id`
- `DELETE api/v1/course/:id`
- `DELETE api/v1/course/:id/remove-faculties`

### Semester Registration

- `GET api/v1/semester-registration`
- `GET api/v1/semester-registration/get-my-registration`
- `GET api/v1/semester-registration/get-my-semester-courses`
- `GET api/v1/semester-registration/:id`
- `POST api/v1/semester-registration`
- `POST api/v1/semester-registration/start-registration`
- `POST api/v1/semester-registration/confirm-my-registration`
- `POST api/v1/semester-registration/:id/start-new-semester`
- `POST api/v1/semester-registration/enroll-into-course`
- `POST api/v1/semester-registration/withdraw-from-course`
- `PATCH api/v1/semester-registration/:id`
- `DELETE api/v1/semester-registration/:id`

### Offered Course

- `GET api/v1/offered-course`
- `GET api/v1/offered-course/:id`
- `POST api/v1/offered-course`
- `PATCH api/v1/offered-course/:id`
- `DELETE api/v1/offered-course/:id`

### Offered Course Section

- `GET api/v1/offered-course-section`
- `GET api/v1/offered-course-section/:id`
- `POST api/v1/offered-course-section`
- `PATCH api/v1/offered-course-section/:id`
- `DELETE api/v1/offered-course-section/:id`

### Offered Course Class Schedule

- `GET api/v1/offered-course-class-schedule`
- `GET api/v1/offered-course-class-schedule/:id`
- `POST api/v1/offered-course-class-schedule`
- `PATCH api/v1/offered-course-class-schedule/:id`
- `DELETE api/v1/offered-course-class-schedule/:id`

### Student Enrolled Course

- `GET api/v1/student-enrolled-course`
- `GET api/v1/student-enrolled-course/:id`
- `POST api/v1/student-enrolled-course`
- `PATCH api/v1/student-enrolled-course/:id`
- `DELETE api/v1/student-enrolled-course/:id`

### Student Enrolled Course Marks

- `GET api/v1/student-enrolled-course-marks`
- `GET api/v1/student-enrolled-course-marks/my-marks`
- `PATCH api/v1/student-enrolled-course-marks/update-student-marks`
- `PATCH api/v1/student-enrolled-course-marks/update-final-total-marks`

### Student Semester Payment

- `GET api/v1/student-semester-payment`
