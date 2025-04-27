import { CustomTheme } from "@/common/constants/theme";
import { useTheme } from "react-native-paper";

export const useCustomTheme = () => useTheme<CustomTheme>();
