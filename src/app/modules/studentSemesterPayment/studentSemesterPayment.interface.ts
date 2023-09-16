export type IStudentSemesterPaymentFilterRequest = {
  searchTerm?: string | undefined;
  academicSemesterId?: string | undefined;
  studentId?: string | undefined;
};

export type IStudentPaymentPayload = {
  studentId: string;
  academicSemesterId: string;
  totalPaymentAmount: number;
};
