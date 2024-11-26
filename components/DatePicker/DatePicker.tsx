import { getYear } from "date-fns";
import React from "react";
import { DatePickerModal } from "react-native-paper-dates";
import {
  CalendarDate,
  SingleChange,
} from "react-native-paper-dates/lib/typescript/Date/Calendar";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (date: CalendarDate) => void;
  date?: Date;
};

const DatePicker = ({
  visible,
  onDismiss,
  onConfirm,
  date = new Date(),
}: Props) => {
  const handleOnConfirm: SingleChange = ({ date }) => {
    onConfirm(date);
    onDismiss();
  };

  return (
    <DatePickerModal
      visible={visible}
      date={date}
      onDismiss={onDismiss}
      onConfirm={handleOnConfirm}
      locale="en"
      mode="single"
      saveLabel="Go to date"
      validRange={{ endDate: new Date() }}
      endYear={getYear(new Date())}
      startYear={2000}
    />
  );
};

export default DatePicker;
