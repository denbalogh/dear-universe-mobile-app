import { useEffect, useState } from "react";
import Day from "../models/Day";
import database, { daysCollection } from "../models/db";

export default function useDayFromDb(dateId: string): Day | null {
  const [day, setDay] = useState<Day | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Try to find the day in the database
        setDay(await daysCollection.find(dateId));
      } catch {
        await database.write(async () => {
          // If the day doesn't exist, create it
          setDay(
            await daysCollection.create((day) => {
              day._raw.id = dateId;
              day.title = "";
            }),
          );
        });
      }
    })();
  }, [dateId]);

  return day;
}
