import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Media } from "../types/Media";

export const NEW_ENTRY_ID = "new-entry";

type EntryEditorContextType = {
  entryId: string | null;
  setEntryId: (id: string | null) => void;
  setNewEntryId: () => void;
  text: string;
  setText: (text: string) => void;
  recordingUri: string;
  setRecordingUri: (uri: string) => void;
  media: Media[];
  setMedia: (media: Media[]) => void;
  feelingsGroup: FEELING_GROUP_NAMES;
  setFeelingsGroup: (group: FEELING_GROUP_NAMES) => void;
  feelingsEmotions: string[];
  setFeelingsEmotions: (emotions: string[]) => void;
  isEmpty: boolean;
  clear: () => void;
};

const EntryEditorContext = createContext<EntryEditorContextType>({
  entryId: null,
  setEntryId: () => {},
  setNewEntryId: () => {},
  text: "",
  setText: () => {},
  recordingUri: "",
  setRecordingUri: () => {},
  media: [],
  setMedia: () => {},
  feelingsGroup: FEELING_GROUP_NAMES.NEUTRAL,
  setFeelingsGroup: () => {},
  feelingsEmotions: [],
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

  const setNewEntryId = useCallback(() => {
    setEntryId(NEW_ENTRY_ID);
  }, []);

  return (
    <EntryEditorContext.Provider
      value={{
        entryId,
        setEntryId,
        setNewEntryId,
        text,
        setText,
        recordingUri,
        setRecordingUri,
        media,
        setMedia,
        feelingsGroup,
        setFeelingsGroup,
        feelingsEmotions,
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
