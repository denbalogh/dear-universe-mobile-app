import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import useSettingsObject from "./useSettingsObject";

const useTermsAndPoliciesHandler = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const { settingsObject } = useSettingsObject();
  const { termsAndPoliciesUnderstood } = settingsObject || {};

  const hasCheckedTheTermsInitially = useRef(false);

  // Initial lock screen check
  useEffect(() => {
    if (!rootNavigationState.key || hasCheckedTheTermsInitially.current) {
      return;
    }

    if (!termsAndPoliciesUnderstood) {
      router.navigate({
        pathname: "/terms",
      });
    }

    hasCheckedTheTermsInitially.current = true;
  }, [termsAndPoliciesUnderstood, router, rootNavigationState.key]);
};

export default useTermsAndPoliciesHandler;
