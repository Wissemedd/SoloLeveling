import { Platform } from "react-native";
import { logWarning } from "@/lib/logger";

export type HealthConnectAvailability =
  | "available" // Health Connect is installed and ready
  | "needs-update" // installed but the provider app needs an update
  | "unavailable" // not installed, or this build doesn't include the native module yet
  | "unsupported-platform"; // iOS — Health Connect is Android-only

/**
 * Thin wrapper around `react-native-health-connect`. Every call is
 * funneled through this module so the native library is never imported
 * anywhere else — `TurboModuleRegistry.getEnforcing` throws the instant its
 * JS is evaluated on a platform/build that doesn't have the native module
 * linked (iOS, Expo Go, or a dev client built before this feature was
 * added), so we gate by platform *and* swallow that throw, degrading to a
 * safe no-op instead of crashing the app.
 */
async function loadNativeModule() {
  if (Platform.OS !== "android") return null;
  try {
    return await import("react-native-health-connect");
  } catch {
    return null;
  }
}

export async function checkAvailability(): Promise<HealthConnectAvailability> {
  const hc = await loadNativeModule();
  if (!hc) return Platform.OS === "android" ? "unavailable" : "unsupported-platform";
  try {
    const status = await hc.getSdkStatus();
    if (status === hc.SdkAvailabilityStatus.SDK_AVAILABLE) return "available";
    if (status === hc.SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) return "needs-update";
    return "unavailable";
  } catch {
    return "unavailable";
  }
}

export async function requestStepsPermission(): Promise<boolean> {
  const hc = await loadNativeModule();
  if (!hc) return false;
  try {
    await hc.initialize();
    const granted = await hc.requestPermission([{ accessType: "read", recordType: "Steps" }]);
    return granted.some((p) => "recordType" in p && p.recordType === "Steps");
  } catch (error) {
    logWarning("healthConnectService.requestStepsPermission", error);
    return false;
  }
}

export async function hasStepsPermission(): Promise<boolean> {
  const hc = await loadNativeModule();
  if (!hc) return false;
  try {
    await hc.initialize();
    const granted = await hc.getGrantedPermissions();
    return granted.some((p) => "recordType" in p && p.recordType === "Steps");
  } catch (error) {
    logWarning("healthConnectService.hasStepsPermission", error);
    return false;
  }
}

/** Total steps recorded since local midnight, aggregated across every source Health Connect knows about (including Samsung Health). */
export async function readTodaySteps(): Promise<number> {
  const hc = await loadNativeModule();
  if (!hc) return 0;
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const result = await hc.aggregateRecord({
      recordType: "Steps",
      timeRangeFilter: {
        operator: "between",
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    });
    return result.COUNT_TOTAL ?? 0;
  } catch (error) {
    logWarning("healthConnectService.readTodaySteps", error);
    return 0;
  }
}

/** Deep-links to the Health Connect app so the hunter can install/update it or manage permissions. */
export async function openHealthConnectSettings(): Promise<void> {
  const hc = await loadNativeModule();
  hc?.openHealthConnectSettings();
}
