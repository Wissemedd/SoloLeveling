import type { Ionicons } from "@expo/vector-icons";
import { isWissem } from "@/features/classes/engine/classEngine";

export type AvatarOption = {
  id: string;
  className: string;
  pathLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

/**
 * Starting archetypes — each is the tier-E root of a full class evolution
 * tree (see src/features/classes). No longer purely cosmetic: the path
 * picked here determines which classes the hunter can grow into.
 */
export const avatarOptions: AvatarOption[] = [
  { id: "vanguard", className: "Recruit", pathLabel: "Path of Strength", icon: "shield", color: "#9D4EFF" },
  { id: "phantom", className: "Scout", pathLabel: "Path of Agility", icon: "flash", color: "#22D9F5" },
  { id: "priest", className: "Disciple", pathLabel: "Path of Support", icon: "fitness", color: "#F5B94D" },
  { id: "mage", className: "Apprentice", pathLabel: "Path of Magic", icon: "eye", color: "#B87BFF" },
];

/** Secret legendary archetype — only revealed when the hunter's name is "Wissem". */
export const monarchAvatarOption: AvatarOption = {
  id: "monarch",
  className: "Awakened Shadow",
  pathLabel: "Path of the Shadow Monarch",
  icon: "skull",
  color: "#5B1FC2",
};

/** The class picker's option list — grows to include the secret Monarch path for "Wissem". */
export function getAvatarOptions(name: string): AvatarOption[] {
  return isWissem(name) ? [...avatarOptions, monarchAvatarOption] : avatarOptions;
}
