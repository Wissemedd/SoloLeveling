export const fonts = {
  display: "Orbitron_700Bold",
  displayBlack: "Orbitron_900Black",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
} as const;

/** Load these via useFonts() at the app root before rendering the tree. */
export { Orbitron_700Bold, Orbitron_900Black } from "@expo-google-fonts/orbitron";
export {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
