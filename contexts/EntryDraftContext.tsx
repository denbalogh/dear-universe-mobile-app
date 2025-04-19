import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { Media } from "@/types/Media";
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type EntryDraftContextType = {
  text: string;
  recordingUri: string;
  media: Media[];
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions: string[];
  setText: (text: string) => void;
  setRecordingUri: (uri: string) => void;
  setMedia: (media: Media[]) => void;
  setFeelingsGroup: (group: FEELING_GROUP_NAMES) => void;
  setFeelingsEmotions: (emotions: string[]) => void;
  isEmpty: boolean;
};

const EntryDraftContext = createContext<EntryDraftContextType>({
  text: "",
  recordingUri: "",
  media: [],
  feelingsGroup: FEELING_GROUP_NAMES.NEUTRAL,
  feelingsEmotions: [],
  setText: () => {},
  setRecordingUri: () => {},
  setMedia: () => {},
  setFeelingsGroup: () => {},
  setFeelingsEmotions: () => {},
  isEmpty: true,
});

type ProviderProps = {
  children: ReactNode;
};

const EntryDraftContextProvider = ({ children }: ProviderProps) => {
  const [text, setText] = useState<string>("");
  const [recordingUri, setRecordingUri] = useState<string>("");
  const [media, setMedia] = useState<Media[]>([]);
  const [feelingsGroup, setFeelingsGroup] = useState<FEELING_GROUP_NAMES>(
    FEELING_GROUP_NAMES.NEUTRAL,
  );
  const [feelingsEmotions, setFeelingsEmotions] = useState<string[]>([]);

  const isEmpty = useMemo(() => {
    return (
      !text && !recordingUri && media.length === 0 && !feelingsEmotions.length
    );
  }, [text, recordingUri, media, feelingsEmotions]);

  return (
    <EntryDraftContext.Provider
      value={{
        text,
        recordingUri,
        media,
        feelingsGroup,
        feelingsEmotions,
        setText,
        setRecordingUri,
        setMedia,
        setFeelingsGroup,
        setFeelingsEmotions,
        isEmpty,
      }}
    >
      {children}
    </EntryDraftContext.Provider>
  );
};

const useEntryDraft = () => useContext(EntryDraftContext);

export { useEntryDraft, EntryDraftContextProvider };
