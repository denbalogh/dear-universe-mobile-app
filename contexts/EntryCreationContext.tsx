import { Media } from "@/components/MediaGallery/EditableMediaGallery";
import { Feelings } from "@/constants/feelings";
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type EntryCreationContextType = {
  text: string;
  recordingUri: string;
  media: Media[];
  feelings: Feelings | null;
  setText: (text: string) => void;
  setRecordingUri: (uri: string) => void;
  setMedia: (media: Media[]) => void;
  setFeelings: (feelings: Feelings | null) => void;
  isEmpty: boolean;
};

const EntryCreationContext = createContext<EntryCreationContextType>({
  text: "",
  recordingUri: "",
  media: [],
  feelings: null,
  setText: () => {},
  setRecordingUri: () => {},
  setMedia: () => {},
  setFeelings: () => {},
  isEmpty: true,
});

type ProviderProps = {
  children: ReactNode;
};

const EntryCreationContextProvider = ({ children }: ProviderProps) => {
  const [text, setText] = useState<string>("");
  const [recordingUri, setRecordingUri] = useState<string>("");
  const [media, setMedia] = useState<Media[]>([]);
  const [feelings, setFeelings] = useState<Feelings | null>(null);

  const isEmpty = useMemo(() => {
    return !text && !recordingUri && media.length === 0 && !feelings;
  }, [text, recordingUri, media, feelings]);

  return (
    <EntryCreationContext.Provider
      value={{
        text,
        recordingUri,
        media,
        feelings,
        setText,
        setRecordingUri,
        setMedia,
        setFeelings,
        isEmpty,
      }}
    >
      {children}
    </EntryCreationContext.Provider>
  );
};

const useEntryCreation = () => useContext(EntryCreationContext);

export { useEntryCreation, EntryCreationContextProvider };
