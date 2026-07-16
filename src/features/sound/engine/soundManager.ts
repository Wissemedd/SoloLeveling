import { createAudioPlayer, type AudioPlayer } from "expo-audio";

export type SoundKey =
  | "level_up"
  | "xp_gain"
  | "chest_open"
  | "reward_reveal"
  | "boss_defeat"
  | "mission_complete"
  | "button_tap";

/**
 * No audio assets ship with this build yet — register each key here with a
 * `require("../../../assets/sounds/xyz.mp3")` once real SFX are dropped in.
 * `playSound` no-ops safely for any key without a registered asset, so the
 * rest of the app can call it today and get real audio for free the moment
 * assets land.
 */
const SOUND_ASSETS: Partial<Record<SoundKey, number>> = {};

const loadedPlayers = new Map<SoundKey, AudioPlayer>();

export async function playSound(key: SoundKey): Promise<void> {
  const asset = SOUND_ASSETS[key];
  if (!asset) return;

  try {
    let player = loadedPlayers.get(key);
    if (!player) {
      player = createAudioPlayer(asset);
      loadedPlayers.set(key, player);
    }
    player.seekTo(0);
    player.play();
  } catch {
    // Audio playback is best-effort — never block gameplay on a missing device audio session.
  }
}

export async function unloadAllSounds(): Promise<void> {
  loadedPlayers.forEach((player) => {
    try {
      player.remove();
    } catch {
      // Best-effort cleanup — player may already be released.
    }
  });
  loadedPlayers.clear();
}
