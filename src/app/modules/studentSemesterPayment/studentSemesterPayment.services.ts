import { PrismaClient } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';

type IStudentPaymentPayload = {
  studentId: string;
  academicSemesterId: string;
  totalPaymentAmount: number;
};

const createSemesterPayment = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: IStudentPaymentPayload
) => {
  console.log(payload);
};

export const StudentSemesterPaymentService = {
  createSemesterPayment,
};
