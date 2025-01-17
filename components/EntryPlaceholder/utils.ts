import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { Phrase, phrases } from "./constants";

export type RandomEntry = {
  media: boolean[];
  hasRecording: boolean;
  feelingsGroupName: FEELING_GROUP_NAMES;
} & Phrase;

const getRandomPhrase = (): Phrase => {
  return phrases[Math.floor(Math.random() * phrases.length)];
};

// Get a random number of booleans between 0 and 8
const getRandomMediaAsBooleans = () => {
  const count = Math.floor(Math.random() * 5);
  return Array.from({ length: count }, () => Math.random() > 0.5);
};

const getRandomHasRecording = () => {
  return Math.random() > 0.5;
};

const getRandomFeelingsGroupName = () => {
  return Object.values(FEELING_GROUP_NAMES)[
    Math.floor(Math.random() * Object.values(FEELING_GROUP_NAMES).length)
  ];
};

export const getRandomEntry = (): RandomEntry => {
  const phrase = getRandomPhrase();
  const hasRecording = getRandomHasRecording();
  const media = getRandomMediaAsBooleans();
  const feelingsGroupName = getRandomFeelingsGroupName();

  return {
    ...phrase,
    hasRecording,
    media,
    feelingsGroupName,
  };
};
