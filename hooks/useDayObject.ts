import { Day } from "@/models/Day";
import { isDateIdFormat } from "@/utils/date";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { useObject, useRealm } from "@realm/react";
import { useCallback, useEffect } from "react";
import { UpdateMode } from "realm";

type ReturnType = {
  dayObject: Day | null;
  updateDayObject: (data: Partial<Day>) => void;
};

const useDayObject = (dateId: string): ReturnType => {
  if (!isDateIdFormat(dateId)) {
    throw new Error("Invalid dateId format");
  }

  const realm = useRealm();
  const dayObject = useObject(Day, dateId);

  useEffect(() => {
    if (dayObject === null) {
      getCrashlytics().log("Creating new Day object");
      realm.write(() => {
        realm.create(Day, {
          _id: dateId,
        });
      });
    }
  }, [dateId, dayObject, realm]);

  const updateDayObject = useCallback(
    (data: Partial<Day>) => {
      getCrashlytics().log("Updating Day object");
      realm.write(() => {
        realm.create(
          Day,
          {
            _id: dateId,
            ...data,
          },
          UpdateMode.Modified,
        );
      });
    },
    [dateId, realm],
  );

  return { dayObject, updateDayObject };
};

export default useDayObject;
