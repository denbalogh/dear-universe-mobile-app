import { getAuth } from "@react-native-firebase/auth";
import { useEffect } from "react";

const useFirebaseAuthHandler = () => {
  useEffect(() => {
    const handleAnonymousSignIn = async () => {
      await getAuth().signInAnonymously();
    };

    handleAnonymousSignIn();
  }, []);
};

export default useFirebaseAuthHandler;
