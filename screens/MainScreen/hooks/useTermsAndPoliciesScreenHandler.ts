import { useSettings } from "@/common/providers/SettingsProvider";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const useTermsAndPoliciesHandler = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const settings = useSettings();
  const { termsUnderstood } = settings;

  const hasCheckedTheTermsInitially = useRef(false);

  // // Initial lock screen check
  useEffect(() => {
    if (!rootNavigationState.key || hasCheckedTheTermsInitially.current) {
      return;
    }

    if (!termsUnderstood) {
      router.navigate({
        pathname: "/terms",
      });
    }

    hasCheckedTheTermsInitially.current = true;
  }, [termsUnderstood, router, rootNavigationState.key]);
};

export default useTermsAndPoliciesHandler;
