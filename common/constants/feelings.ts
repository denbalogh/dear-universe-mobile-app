export enum FEELING_GROUP_NAMES {
  VERY_UNPLEASANT = "Very unpleasant",
  UNPLEASANT = "Unpleasant",
  NEUTRAL = "Neutral",
  PLEASANT = "Pleasant",
  VERY_PLEASANT = "Very pleasant",
}

export const emotionsGroups: Record<FEELING_GROUP_NAMES, string[]> = {
  [FEELING_GROUP_NAMES.VERY_PLEASANT]: [
    "Ecstatic",
    "Blissful",
    "Loving",
    "Joyful",
    "Radiant",
    "Exuberant",
    "Empowered",
    "Energized",
    "Fulfilled",
  ],
  [FEELING_GROUP_NAMES.PLEASANT]: [
    "Peaceful",
    "Optimistic",
    "Grateful",
    "Happy",
    "Compassionate",
    "Hopeful",
    "Friendly",
    "Warm",
    "Inspired",
  ],
  [FEELING_GROUP_NAMES.NEUTRAL]: [
    "Calm",
    "Indifferent",
    "Reflective",
    "Accepting",
    "Thoughtful",
    "Content",
    "Open",
    "Composed",
    "Neutral",
  ],
  [FEELING_GROUP_NAMES.UNPLEASANT]: [
    "Frustrated",
    "Irritated",
    "Yearning",
    "Jealous",
    "Proud",
    "Restless",
    "Annoyed",
    "Dissatisfied",
    "Bored",
  ],
  [FEELING_GROUP_NAMES.VERY_UNPLEASANT]: [
    "Ashamed",
    "Guilty",
    "Hopeless",
    "Despairing",
    "Fearful",
    "Helpless",
    "Angry",
    "Anxious",
    "Regretful",
    "Grieving",
  ],
};

export const feelingColorsLight = {
  // Very pleasant
  [`${FEELING_GROUP_NAMES.VERY_PLEASANT}base`]: "#8A2BE2",
  [FEELING_GROUP_NAMES.VERY_PLEASANT]: "#6e528a",
  [`on${FEELING_GROUP_NAMES.VERY_PLEASANT}`]: "#ffffff",
  [`${FEELING_GROUP_NAMES.VERY_PLEASANT}Container`]: "#efdbff",
  [`on${FEELING_GROUP_NAMES.VERY_PLEASANT}Container`]: "#280d42",
  // Pleasant
  [`${FEELING_GROUP_NAMES.PLEASANT}base`]: "#32CD32",
  [FEELING_GROUP_NAMES.PLEASANT]: "#3e6837",
  [`on${FEELING_GROUP_NAMES.PLEASANT}`]: "#ffffff",
  [`${FEELING_GROUP_NAMES.PLEASANT}Container`]: "#bff0b1",
  [`on${FEELING_GROUP_NAMES.PLEASANT}Container`]: "#002201",
  // Neutral
  [`${FEELING_GROUP_NAMES.NEUTRAL}base`]: "#B0C4DE",
  [FEELING_GROUP_NAMES.NEUTRAL]: "#34618d",
  [`on${FEELING_GROUP_NAMES.NEUTRAL}`]: "#ffffff",
  [`${FEELING_GROUP_NAMES.NEUTRAL}Container`]: "#d0e4ff",
  [`on${FEELING_GROUP_NAMES.NEUTRAL}Container`]: "#001d35",
  // Unpleasant
  [`${FEELING_GROUP_NAMES.UNPLEASANT}base`]: "#D2691E",
  [FEELING_GROUP_NAMES.UNPLEASANT]: "#8c4f28",
  [`on${FEELING_GROUP_NAMES.UNPLEASANT}`]: "#ffffff",
  [`${FEELING_GROUP_NAMES.UNPLEASANT}Container`]: "#ffdbc9",
  [`on${FEELING_GROUP_NAMES.UNPLEASANT}Container`]: "#321200",
  // Very unpleasant
  [`${FEELING_GROUP_NAMES.VERY_UNPLEASANT}base`]: "#8B0000",
  [FEELING_GROUP_NAMES.VERY_UNPLEASANT]: "#904b40",
  [`on${FEELING_GROUP_NAMES.VERY_UNPLEASANT}`]: "#ffffff",
  [`${FEELING_GROUP_NAMES.VERY_UNPLEASANT}Container`]: "#ffdad4",
  [`on${FEELING_GROUP_NAMES.VERY_UNPLEASANT}Container`]: "#3a0905",
};

export const feelingColorsDark = {
  // Very pleasant
  [`${FEELING_GROUP_NAMES.VERY_PLEASANT}base`]: "#8A2BE2",
  [FEELING_GROUP_NAMES.VERY_PLEASANT]: "#dab9f9",
  [`on${FEELING_GROUP_NAMES.VERY_PLEASANT}`]: "#3e2459",
  [`${FEELING_GROUP_NAMES.VERY_PLEASANT}Container`]: "#553b71",
  [`on${FEELING_GROUP_NAMES.VERY_PLEASANT}Container`]: "#efdbff",
  // Pleasant
  [`${FEELING_GROUP_NAMES.PLEASANT}base`]: "#32CD32",
  [FEELING_GROUP_NAMES.PLEASANT]: "#a4d397",
  [`on${FEELING_GROUP_NAMES.PLEASANT}`]: "#0f380c",
  [`${FEELING_GROUP_NAMES.PLEASANT}Container`]: "#275021",
  [`on${FEELING_GROUP_NAMES.PLEASANT}Container`]: "#bff0b1",
  // Neutral
  [`${FEELING_GROUP_NAMES.NEUTRAL}base`]: "#B0C4DE",
  [FEELING_GROUP_NAMES.NEUTRAL]: "#9fcafc",
  [`on${FEELING_GROUP_NAMES.NEUTRAL}`]: "#003256",
  [`${FEELING_GROUP_NAMES.NEUTRAL}Container`]: "#164974",
  [`on${FEELING_GROUP_NAMES.NEUTRAL}Container`]: "#d0e4ff",
  // Unpleasant
  [`${FEELING_GROUP_NAMES.UNPLEASANT}base`]: "#D2691E",
  [FEELING_GROUP_NAMES.UNPLEASANT]: "#ffb68d",
  [`on${FEELING_GROUP_NAMES.UNPLEASANT}`]: "#532200",
  [`${FEELING_GROUP_NAMES.UNPLEASANT}Container`]: "#6f3812",
  [`on${FEELING_GROUP_NAMES.UNPLEASANT}Container`]: "#ffdbc9",
  // Very unpleasant
  [`${FEELING_GROUP_NAMES.VERY_UNPLEASANT}base`]: "#8B0000",
  [FEELING_GROUP_NAMES.VERY_UNPLEASANT]: "#ffb4a8",
  [`on${FEELING_GROUP_NAMES.VERY_UNPLEASANT}`]: "#561e16",
  [`${FEELING_GROUP_NAMES.VERY_UNPLEASANT}Container`]: "#73342b",
  [`on${FEELING_GROUP_NAMES.VERY_UNPLEASANT}Container`]: "#ffdad4",
};

export type FeelingColors = typeof feelingColorsLight;
