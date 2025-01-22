import { SETTINGS_ID } from "@/constants/settings";
import { Settings } from "@/models/Settings";
import { useObject, useRealm } from "@realm/react";
import { useEffect } from "react";
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
      realm.write(() => {
        realm.create(Settings, {
          _id: SETTINGS_ID,
        });
      });
    }
  }, [settingsObject, realm]);

  const updateSettingsObject = (data: Partial<Settings>) => {
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
  };

  return { settingsObject, updateSettingsObject };
};

export default useSettingsObject;
