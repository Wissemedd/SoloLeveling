import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { monsters } from "../data/monsters";
import { useBestiaryStore } from "../store/bestiaryStore";
import { MonsterSprite } from "../components/MonsterSprite";

export function BestiaryScreen() {
  const entries = useBestiaryStore((s) => s.entries);
  const discoveredCount = Object.keys(entries).length;

  return (
    <ScreenBackground accent="danger" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Bestiary" subtitle={`${discoveredCount} / ${monsters.length} discovered`} />
        {monsters.map((monster) => {
          const entry = entries[monster.id];
          const discovered = !!entry;
          return (
            <GlassPanel key={monster.id} glow={monster.isBoss ? "gold" : "none"} style={styles.row}>
              {discovered ? (
                <MonsterSprite monster={monster} size={48} animated={false} />
              ) : (
                <View style={styles.unknownIcon}>
                  <Ionicons name="help-circle" size={22} color={colors.slate} />
                </View>
              )}
              <View style={styles.rowText}>
                <View style={styles.titleLine}>
                  <Text style={styles.name}>{discovered ? monster.name : "???"}</Text>
                  {monster.isBoss ? <Chip label="Boss" tier="legendary" /> : null}
                  <Chip label={monster.rank} tier="common" />
                </View>
                {discovered ? (
                  <>
                    <Text style={styles.description}>{monster.description}</Text>
                    <Text style={styles.statsLine}>
                      Encounters {entry.encounters} · Victories {entry.victories}
                      {monster.weakness ? ` · Weak to ${monster.weakness}` : ""}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.description}>Encounter this creature in a Gate to reveal its data.</Text>
                )}
              </View>
            </GlassPanel>
          );
        })}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14 },
  unknownIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, gap: 4 },
  titleLine: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  name: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  description: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  statsLine: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.danger[300] },
});
