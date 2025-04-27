export type SettingsTheme = "light" | "dark" | "system";

export type Settings = {
  id: string;
  theme: SettingsTheme;
  lockCodeHash?: string;
  lockUseBiometric: boolean;
  dailyReminderAt?: Date;
  dailyReminderMessage?: string;
  termsUnderstood: boolean;
};
