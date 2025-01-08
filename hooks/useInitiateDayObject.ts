import { Day } from "@/models/Day";
import { isDateIdFormat } from "@/utils/date";
import { useObject, useRealm } from "@realm/react";
import { useEffect } from "react";

const useInitiateDayObject = (dateId: string) => {
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

  return dayObject;
};

export default useInitiateDayObject;
