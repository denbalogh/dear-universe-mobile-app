import { CustomTheme } from "@/constants/theme";
import { useTheme } from "react-native-paper";

export const useCustomTheme = () => useTheme<CustomTheme>();
