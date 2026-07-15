import { Audio } from "expo-av";

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

const loadedSounds = new Map<SoundKey, Audio.Sound>();

export async function playSound(key: SoundKey): Promise<void> {
  const asset = SOUND_ASSETS[key];
  if (!asset) return;

  try {
    let sound = loadedSounds.get(key);
    if (!sound) {
      const { sound: created } = await Audio.Sound.createAsync(asset);
      sound = created;
      loadedSounds.set(key, sound);
    }
    await sound.replayAsync();
  } catch {
    // Audio playback is best-effort — never block gameplay on a missing device audio session.
  }
}

export async function unloadAllSounds(): Promise<void> {
  await Promise.all([...loadedSounds.values()].map((s) => s.unloadAsync().catch(() => {})));
  loadedSounds.clear();
}
