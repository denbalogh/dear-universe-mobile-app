import Day from "@/common/models/Day";
import database, { daysCollection } from "@/common/models/db";
import { withObservables } from "@nozbe/watermelondb/react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const DayContext = createContext<{ day: Day | null }>({ day: null });

export const useDay = () => {
  const { day } = useContext(DayContext);
  return day as Day; // Cast to Day, since we know it's not null
};

type ProviderProps = {
  day: Day;
  children: React.ReactNode;
};

const Provider = ({ day, children }: ProviderProps) => {
  return <DayContext.Provider value={{ day }}>{children}</DayContext.Provider>;
};

type Observed = {
  day: Day;
};

const EnhancedProvider = withObservables<Observed, Observed>([], ({ day }) => ({
  day,
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

  useEffect(() => {
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
  }, [dayId]);

  if (!day) return loadingComponent;

  return <EnhancedProvider day={day}>{children}</EnhancedProvider>;
};

export default DayProvider;
