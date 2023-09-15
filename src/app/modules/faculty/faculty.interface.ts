export type IFacultyFilterRequest = {
  searchTerm?: string | undefined;
  academicFacultyId?: string | undefined;
  academicDepartmentId?: string | undefined;
  studentId?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  bloodGroup?: string | undefined;
};

export type IFacultyPayloadFilter = {
  academicSemesterId?: string | null | undefined;
  courseId?: string | null | undefined;
};

export type IFacultyUserPayload = {
    userId: string;
    role: string;
  }