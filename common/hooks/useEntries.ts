import { useEffect, useState } from "react";
import Entry from "../models/Entry";
import Day from "../models/Day";

const useEntries = (day: Day) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    (async () => {
      const entries = await day.entries?.fetch();
      if (entries) {
        setEntries(entries);
      }
    })();
  }, [day]);

  return entries;
};

export default useEntries;
