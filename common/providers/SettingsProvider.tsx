import database, { settingsCollection } from "@/common/models/db";
import Settings, { SETTINGS_INSTANCE_ID } from "@/common/models/Settings";
import { withObservables } from "@nozbe/watermelondb/react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const SettingsContext = createContext<{ settings: Settings | null }>({
  settings: null,
});

export const useSettings = () => {
  const { settings } = useContext(SettingsContext);
  return settings as Settings; // Cast to Settings, since we know it's not null
};

type ProviderProps = {
  settings: Settings;
  children: React.ReactNode;
};

const Provider = ({ settings, children }: ProviderProps) => {
  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
};

type Observed = {
  settings: Settings;
};

const EnhancedProvider = withObservables<Observed, Observed>(
  [],
  ({ settings }) => ({ settings }),
)(Provider);

type SettingsProviderProps = {
  children: ReactNode;
  loadingComponent?: ReactNode;
};

const SettingsProvider = ({
  children,
  loadingComponent = null,
}: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Try to find the day in the database
        setSettings(await settingsCollection.find(SETTINGS_INSTANCE_ID));
      } catch {
        await database.write(async () => {
          // If the day doesn't exist, create it
          setSettings(
            await settingsCollection.create((settings) => {
              settings._raw.id = SETTINGS_INSTANCE_ID;
              settings.theme = "system";
              settings.lockUseBiometrics = false;
              settings.termsUnderstood = false;
            }),
          );
        });
      }
    })();
  }, []);

  if (!settings) return loadingComponent;

  return <EnhancedProvider settings={settings}>{children}</EnhancedProvider>;
};

export default SettingsProvider;
