import { SETTINGS_ID } from "@/constants/settings";
import { Settings } from "@/models/Settings";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { useObject, useRealm } from "@realm/react";
import { useCallback, useEffect } from "react";
import { UpdateMode } from "realm";

type ReturnType = {
  settingsObject: Settings | null;
  updateSettingsObject: (data: Partial<Settings>) => void;
};

const useSettingsObject = (): ReturnType => {
  const realm = useRealm();
  const settingsObject = useObject(Settings, SETTINGS_ID);

  useEffect(() => {
    if (settingsObject === null) {
      getCrashlytics().log("Creating new Settings object");
      realm.write(() => {
        realm.create(Settings, {
          _id: SETTINGS_ID,
        });
      });
    }
  }, [settingsObject, realm]);

  const updateSettingsObject = useCallback(
    (data: Partial<Settings>) => {
      getCrashlytics().log("Updating Settings object");
      realm.write(() => {
        realm.create(
          Settings,
          {
            _id: SETTINGS_ID,
            ...data,
          },
          UpdateMode.Modified,
        );
      });
    },
    [realm],
  );

  return { settingsObject, updateSettingsObject };
};

export default useSettingsObject;
