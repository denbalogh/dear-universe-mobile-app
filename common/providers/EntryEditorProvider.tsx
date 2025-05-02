import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { Media } from "../types/Media";

type EntryEditorContextType = {
  entryId: string | null;
  text: string;
  recordingUri: string;
  media: Media[];
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions: string[];
  setEntryId: (id: string | null) => void;
  setText: (text: string) => void;
  setRecordingUri: (uri: string) => void;
  setMedia: (media: Media[]) => void;
  setFeelingsGroup: (group: FEELING_GROUP_NAMES) => void;
  setFeelingsEmotions: (emotions: string[]) => void;
  isEmpty: boolean;
  clear: () => void;
};

const EntryEditorContext = createContext<EntryEditorContextType>({
  entryId: null,
  text: "",
  recordingUri: "",
  media: [],
  feelingsGroup: FEELING_GROUP_NAMES.NEUTRAL,
  feelingsEmotions: [],
  setEntryId: () => {},
  setText: () => {},
  setRecordingUri: () => {},
  setMedia: () => {},
  setFeelingsGroup: () => {},
  setFeelingsEmotions: () => {},
  isEmpty: true,
  clear: () => {},
});

type ProviderProps = {
  children: ReactNode;
};

const EntryEditorProvider = ({ children }: ProviderProps) => {
  const [entryId, setEntryId] = useState<string | null>(null);
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

  const clear = () => {
    setEntryId(null);
    setText("");
    setRecordingUri("");
    setMedia([]);
    setFeelingsGroup(FEELING_GROUP_NAMES.NEUTRAL);
    setFeelingsEmotions([]);
  };

  return (
    <EntryEditorContext.Provider
      value={{
        entryId,
        text,
        recordingUri,
        media,
        feelingsGroup,
        feelingsEmotions,
        setEntryId,
        setText,
        setRecordingUri,
        setMedia,
        setFeelingsGroup,
        setFeelingsEmotions,
        isEmpty,
        clear,
      }}
    >
      {children}
    </EntryEditorContext.Provider>
  );
};

export const useEntryEditor = () => useContext(EntryEditorContext);

export default EntryEditorProvider;
