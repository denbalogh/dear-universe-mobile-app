import { useCallback, useEffect } from "react";
import useAppState from "./useAppState";
import {
  clearLastNotificationResponseAsync,
  getLastNotificationResponseAsync,
} from "expo-notifications";
import { DAILY_REMINDER_IDENTIFIER } from "@/app/dailyReminder";
import { formatDateId } from "@/utils/date";
import { fromUnixTime } from "date-fns/fromUnixTime";
import { useRouter } from "expo-router";
import logCrashlytics from "@/utils/logCrashlytics";

const useNotificationHandler = () => {
  const appState = useAppState();
  const router = useRouter();

  const handleGetLastNotificationResponse = useCallback(async () => {
    logCrashlytics("Handling last notification response");
    const lastNotificationResponse = await getLastNotificationResponseAsync();

    if (lastNotificationResponse === null) {
      return;
    }

    const {
      notification: {
        request: { identifier },
        date,
      },
    } = lastNotificationResponse;

    if (identifier === DAILY_REMINDER_IDENTIFIER) {
      const dateId = formatDateId(fromUnixTime(date / 1000));

      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: { dateId },
      });
    }

    logCrashlytics("Clearing last notification response");
    await clearLastNotificationResponseAsync();
  }, [router]);

  useEffect(() => {
    if (appState === "active") {
      handleGetLastNotificationResponse();
    }
  }, [appState, handleGetLastNotificationResponse]);
};

export default useNotificationHandler;
