import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii } from "@/design-system/theme";
import {
  BEARD_OPTIONS,
  EYE_COLOR_SWATCHES,
  GENDER_OPTIONS,
  HAIR_COLOR_SWATCHES,
  HAIR_STYLE_OPTIONS,
  OUTFIT_OPTIONS,
  SKIN_TONE_OPTIONS,
} from "../data/appearanceOptions";
import type { CharacterAppearance } from "../types";
import { AvatarSilhouette } from "./AvatarSilhouette";

type Props = {
  appearance: CharacterAppearance;
  onChange: (patch: Partial<CharacterAppearance>) => void;
};

export function CharacterEditorForm({ appearance, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.previewWrap}>
        <AvatarSilhouette appearance={appearance} size={180} />
      </View>

      <FieldGroup label="Gender">
        <View style={styles.pillRow}>
          {GENDER_OPTIONS.map((g) => (
            <Pill key={g.id} label={g.label} active={appearance.gender === g.id} onPress={() => onChange({ gender: g.id })} />
          ))}
        </View>
      </FieldGroup>

      <FieldGroup label="Hairstyle">
        <View style={styles.pillRow}>
          {HAIR_STYLE_OPTIONS.map((hs) => (
            <Pill key={hs.id} label={hs.label} active={appearance.hairStyle === hs.id} onPress={() => onChange({ hairStyle: hs.id })} />
          ))}
        </View>
      </FieldGroup>

      <FieldGroup label="Hair color">
        <SwatchRow swatches={HAIR_COLOR_SWATCHES} active={appearance.hairColor} onPick={(hex) => onChange({ hairColor: hex })} />
      </FieldGroup>

      <FieldGroup label="Eye color">
        <SwatchRow swatches={EYE_COLOR_SWATCHES} active={appearance.eyeColor} onPick={(hex) => onChange({ eyeColor: hex })} />
      </FieldGroup>

      <FieldGroup label="Skin tone">
        <SwatchRow
          swatches={SKIN_TONE_OPTIONS.map((s) => s.hex)}
          active={SKIN_TONE_OPTIONS.find((s) => s.id === appearance.skinTone)?.hex}
          onPick={(hex) => {
            const match = SKIN_TONE_OPTIONS.find((s) => s.hex === hex);
            if (match) onChange({ skinTone: match.id });
          }}
        />
      </FieldGroup>

      <FieldGroup label="Beard">
        <View style={styles.pillRow}>
          {BEARD_OPTIONS.map((b) => (
            <Pill key={b.id} label={b.label} active={appearance.beard === b.id} onPress={() => onChange({ beard: b.id })} />
          ))}
        </View>
      </FieldGroup>

      <FieldGroup label="Outfit">
        <View style={styles.pillRow}>
          {OUTFIT_OPTIONS.map((o) => (
            <Pill key={o.id} label={o.label} active={appearance.outfitId === o.id} onPress={() => onChange({ outfitId: o.id })} />
          ))}
        </View>
      </FieldGroup>
    </View>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function SwatchRow({ swatches, active, onPick }: { swatches: string[]; active?: string; onPick: (hex: string) => void }) {
  return (
    <View style={styles.swatchRow}>
      {swatches.map((hex) => (
        <Pressable key={hex} onPress={() => onPick(hex)} style={[styles.swatch, { backgroundColor: hex }, active === hex && styles.swatchActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  previewWrap: { alignItems: "center", paddingVertical: 8 },
  group: { gap: 8 },
  groupLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate, textTransform: "uppercase", letterSpacing: 0.6 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radii.pill, borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" },
  pillActive: { borderColor: colors.arcane[300], backgroundColor: "rgba(157,78,255,0.16)" },
  pillLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate },
  pillLabelActive: { color: colors.arcane[100] },
  swatchRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "rgba(255,255,255,0.12)" },
  swatchActive: { borderColor: colors.white },
});
