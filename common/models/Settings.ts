import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";
import { TableName } from "./schema";
import { SettingsTheme } from "../types/Settings";

export default class Settings extends Model {
  static table = TableName.SETTINGS;

  @text("theme") theme: SettingsTheme = "system";
  @text("lock_code_hash") lockCodeHash?: string;
  @text("lock_use_biometric") lockUseBiometric: boolean = false;
  @text("daily_reminder_at") dailyReminderAt?: Date;
  @text("daily_reminder_message") dailyReminderMessage?: string;
  @text("terms_understood") termsUnderstood: boolean = false;
}
