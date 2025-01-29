import { Day } from "@/models/Day";
import { isDateIdFormat } from "@/utils/date";
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
      realm.write(() => {
        realm.create(Day, {
          _id: dateId,
        });
      });
    }
  }, [dateId, dayObject, realm]);

  const updateDayObject = useCallback(
    (data: Partial<Day>) => {
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
