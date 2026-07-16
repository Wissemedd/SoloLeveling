import type { Ionicons } from "@expo/vector-icons";

export type AvatarOption = {
  id: string;
  className: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

/** Cosmetic starting archetypes — original names, purely flavor, no gameplay effect. */
export const avatarOptions: AvatarOption[] = [
  { id: "vanguard", className: "Vanguard", icon: "shield", color: "#9D4EFF" },
  { id: "phantom", className: "Phantom", icon: "flash", color: "#22D9F5" },
  { id: "priest", className: "Priest", icon: "fitness", color: "#F5B94D" },
  { id: "mage", className: "Mage", icon: "eye", color: "#B87BFF" },
];
