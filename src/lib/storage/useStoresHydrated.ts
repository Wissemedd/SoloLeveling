import { useEffect, useState } from "react";

type PersistCapable = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (cb: () => void) => () => void;
  };
};

/** True once every persisted store passed in has finished rehydrating from disk. */
export function useStoresHydrated(stores: PersistCapable[]): boolean {
  const [hydrated, setHydrated] = useState(() => stores.every((s) => s.persist.hasHydrated()));

  useEffect(() => {
    if (hydrated) return;
    const unsubscribes = stores.map((s) =>
      s.persist.onFinishHydration(() => {
        if (stores.every((store) => store.persist.hasHydrated())) setHydrated(true);
      }),
    );
    if (stores.every((s) => s.persist.hasHydrated())) setHydrated(true);
    return () => unsubscribes.forEach((unsub) => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hydrated;
}
