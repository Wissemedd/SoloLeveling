import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
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

function SkillIcon({ skill, size = 36 }: { skill: SkillDefinition; size?: number }) {
  const color = skill.kind === "active" ? colors.arcane[300] : colors.gold[200];
  const gradientId = `skillGlow-${skill.id}`;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} />
        <Circle cx={size / 2} cy={size / 2} r={size / 2 - 1.5} stroke={color} strokeWidth={1.4} fill="rgba(6,7,14,0.5)" />
      </Svg>
      <View style={styles.skillIconGlyph}>
        <Ionicons name={skill.icon} size={size * 0.5} color={color} />
      </View>
    </View>
  );
}

function SkillRow({ skill }: { skill: SkillDefinition }) {
  return (
    <GlassPanel glow={skill.kind === "active" ? "arcane" : "none"} style={styles.row}>
      <SkillIcon skill={skill} />
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
  skillIconGlyph: { flex: 1, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.white },
  kindTag: { fontFamily: fonts.body, fontSize: 10, color: colors.slate, textTransform: "uppercase" },
  rowDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  cooldown: { fontFamily: fonts.body, fontSize: 11, color: colors.arcane[300], marginTop: 2 },
});
