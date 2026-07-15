import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { fonts, rankColors } from "../theme";
import type { HunterRank } from "@/features/player/types";

type Props = {
  rank: HunterRank;
  size?: number;
};

function hexagonPoints(size: number) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 90);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}

/** The hunter's rank, rendered as a glowing hexagonal seal. */
export function RankBadge({ rank, size = 64 }: Props) {
  const color = rankColors[rank];

  return (
    <View style={[styles.wrapper, { width: size, height: size, shadowColor: color }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Polygon points={hexagonPoints(size)} fill="rgba(10,12,22,0.65)" stroke={color} strokeWidth={2} />
      </Svg>
      <Text style={[styles.rankText, { color, fontSize: size * 0.4 }]}>{rank}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  rankText: {
    fontFamily: fonts.display,
  },
});
