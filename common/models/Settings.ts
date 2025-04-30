import { Model } from "@nozbe/watermelondb";
import { date, field, text } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { SettingsTheme } from "../types/Settings";

export const SETTINGS_INSTANCE_ID = "settings";

export default class Settings extends Model {
  static table = TableName.SETTINGS;

  @text("theme") theme!: SettingsTheme;
  @text("lock_code_hash") lockCodeHash?: string;
  @field("lock_use_biometrics") lockUseBiometrics!: boolean;
  @date("daily_reminder_at") dailyReminderAt?: Date;
  @text("daily_reminder_message") dailyReminderMessage?: string;
  @field("terms_understood") termsUnderstood!: boolean;
}
