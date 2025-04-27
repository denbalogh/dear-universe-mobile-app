import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const useTermsAndPoliciesHandler = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  // const { termsAndPoliciesUnderstood } = settingsObject || {};

  const hasCheckedTheTermsInitially = useRef(false);

  // // Initial lock screen check
  // useEffect(() => {
  //   if (!rootNavigationState.key || hasCheckedTheTermsInitially.current) {
  //     return;
  //   }

  //   if (!termsAndPoliciesUnderstood) {
  //     router.navigate({
  //       pathname: "/terms",
  //     });
  //   }

  //   hasCheckedTheTermsInitially.current = true;
  // }, [termsAndPoliciesUnderstood, router, rootNavigationState.key]);
};

export default useTermsAndPoliciesHandler;
