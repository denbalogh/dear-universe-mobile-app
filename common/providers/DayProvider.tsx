import Day from "@/common/models/Day";
import database, { daysCollection } from "@/common/models/db";
import { withObservables } from "@nozbe/watermelondb/react";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import Entry from "../models/Entry";
import { useFocusEffect } from "expo-router";

const DayContext = createContext<{ day: Day | null; entries: Entry[] }>({
  day: null,
  entries: [],
});

export const useDay = () => {
  const { day, entries } = useContext(DayContext);
  return {
    day: day as Day, // Cast to Day, since we know it's not null
    entries,
  };
};

type ProviderProps = {
  day: Day;
  entries: Entry[];
  children: React.ReactNode;
};

const Provider = ({ day, entries, children }: ProviderProps) => {
  return (
    <DayContext.Provider value={{ day, entries }}>
      {children}
    </DayContext.Provider>
  );
};

// #TODO: Add a type for the entries
const EnhancedProvider = withObservables(["day"], ({ day }) => ({
  day,
  entries: day.entries.observeWithColumns([
    "order_index",
    "text",
    "media",
    "recording_uri",
    "feelings_group",
    "feelings_emotions",
  ]),
}))(Provider);

type DayProviderProps = {
  dayId: string;
  children: ReactNode;
  loadingComponent?: ReactNode;
};

const DayProvider = ({
  children,
  dayId,
  loadingComponent = null,
}: DayProviderProps) => {
  const [day, setDay] = useState<Day | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          // Try to find the day in the database
          setDay(await daysCollection.find(dayId));
        } catch {
          await database.write(async () => {
            // If the day doesn't exist, create it
            setDay(
              await daysCollection.create((day) => {
                day._raw.id = dayId;
                day.title = "";
              }),
            );
          });
        }
      })();
    }, [dayId]),
  );

  if (!day) return loadingComponent;

  return <EnhancedProvider day={day}>{children}</EnhancedProvider>;
};

export default DayProvider;
