import { WeekDays } from '@prisma/client';

type IDayAndTime = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
};

export const hasTimeConflict = (
  existingSlots: IDayAndTime[],
  newSlot: IDayAndTime
) => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

    //if time conflicts, tell true
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
    //else tell false
  }
  return false;
};
