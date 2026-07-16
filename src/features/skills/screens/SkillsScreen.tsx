import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { useClassStore } from "@/features/classes/store/classStore";
import { getPath } from "@/features/classes/engine/classEngine";
import { getSkillsForNode } from "../engine/skillEngine";
import type { SkillDefinition } from "../types";

export function SkillsScreen() {
  const currentNodeId = useClassStore((s) => s.currentNodeId);
  const path = useMemo(() => (currentNodeId ? getPath(currentNodeId) : []), [currentNodeId]);

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Skills" subtitle="One active + one passive per class tier — grows as your class evolves." />
        {path.length === 0 ? <Text style={styles.emptyText}>Your class hasn't awakened yet.</Text> : null}
        {path.map((node) => {
          const skills = getSkillsForNode(node);
          if (!skills) return null;
          return (
            <View key={node.id} style={styles.tierGroup}>
              <Text style={styles.tierLabel}>
                Rank {node.rank} · {node.name}
              </Text>
              <SkillRow skill={skills.active} />
              <SkillRow skill={skills.passive} />
            </View>
          );
        })}
      </ScrollView>
    </ScreenBackground>
  );
}

function SkillRow({ skill }: { skill: SkillDefinition }) {
  return (
    <GlassPanel glow={skill.kind === "active" ? "arcane" : "none"} style={styles.row}>
      <Ionicons name={skill.icon} size={18} color={skill.kind === "active" ? colors.arcane[200] : colors.slate} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>
          {skill.name} <Text style={styles.kindTag}>{skill.kind}</Text>
        </Text>
        <Text style={styles.rowDescription}>{skill.description}</Text>
        {skill.kind === "active" && skill.cooldownRounds ? <Text style={styles.cooldown}>Cooldown: {skill.cooldownRounds} rounds</Text> : null}
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 16 },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  tierGroup: { gap: 8 },
  tierLabel: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.arcane[200], textTransform: "uppercase", letterSpacing: 0.6 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.white },
  kindTag: { fontFamily: fonts.body, fontSize: 10, color: colors.slate, textTransform: "uppercase" },
  rowDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  cooldown: { fontFamily: fonts.body, fontSize: 11, color: colors.arcane[300], marginTop: 2 },
});
