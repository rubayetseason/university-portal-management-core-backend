import { AcademicSemester, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSemester = async (
  academicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: academicSemesterData,
  });
  return result;
};

export const AcademicSemesterService = {
  createSemester,
};
