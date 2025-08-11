import d from "$lib/dominion.json" with { type: "json" };
import type { RadioStatus3, RadioStatus4 } from "./Radios.svelte";
import { db, getBannedItemAsync as getAsync, getAutoSaveId, saveBannedItemAsync as saveAsync, saveAutoSaveId, type BannedItem } from "./history";

export type Expansion = (typeof d.expansions)[0] & {
 landscapeStatusPairArray: { kindId: number, status: RadioStatus3 }[];
 kingdomStatus: RadioStatus3;
};
export type LandscapeKind = (typeof d.landscapeKinds)[0] & {
 landscapeStatus: RadioStatus3;
};
export type Landscape = (typeof d.landscapes)[0] & {
 landscapeStatus: RadioStatus4;
};
export type Kingdom = (typeof d.kingdoms)[0] & {
 kingdomStatus: RadioStatus4;
}
export type Dominion = {
 expansions: Expansion[];
 landscapeKinds: LandscapeKind[];
 landscapes: Landscape[];
 kingdoms: Kingdom[];
};

export const dominion = $state(d as any as Dominion);

export const initializeWithRandom = () => {
 const random = "random";
 for (const item of dominion.expansions) {
  item.kingdomStatus = random;
  item.landscapeStatusPairArray = item.landscapeKinds.map(kindId => { return { kindId, status: random } });
 }

 for (const item of dominion.landscapeKinds) {
  item.landscapeStatus = random;
 }

 for (const item of dominion.kingdoms) {
  item.kingdomStatus = random;
 }

 for (const item of dominion.landscapes) {
  item.landscapeStatus = random;
 }
}
initializeWithRandom();

const ban = "ban";
export const initializeWithBannedItemAsync = async (db: IDBDatabase, id: number, abortSignal?: AbortSignal) => {
 initializeWithRandom();
 const autoSaveId = getAutoSaveId();
 if (Number.isSafeInteger(autoSaveId)) {
  const bannedItem = await getAsync(db, autoSaveId, abortSignal);
  if (bannedItem) {
   for (const expansionId of bannedItem.kingdoms.expansions) {
    const expansion = dominion.expansions[expansionId];
    expansion.kingdomStatus = ban;
    for (const kingdomId of expansion.kingdoms) {
     dominion.kingdoms[kingdomId].kingdomStatus = ban;
    }
   }

   for (const kingdomId of bannedItem.kingdoms.ids) {
    dominion.kingdoms[kingdomId].kingdomStatus = ban;
   }

   for (const kindId of bannedItem.landscapes.kinds.ids) {
    const kind = dominion.landscapeKinds[kindId];
    kind.landscapeStatus = ban;
    for (const landscapeId of kind.landscapes) {
     dominion.landscapes[landscapeId].landscapeStatus = ban;
    }
   }

   for (const { kindId, expansionId } of bannedItem.landscapes.kinds.expansions) {
    const expansion = dominion.expansions[expansionId];
    for (const pair of expansion.landscapeStatusPairArray) {
     if (pair.kindId === kindId) {
      pair.status = ban;
     }
    }

    for (const landscapeId of dominion.landscapeKinds[kindId].landscapes) {
     const landscape = dominion.landscapes[landscapeId];
     if (landscape.expansionId === expansionId) {
      landscape.landscapeStatus = ban;
     }
    }
   }

   for (const landscapeId of bannedItem.landscapes.ids) {
    dominion.landscapes[landscapeId].landscapeStatus = ban;
   }
  }
 }
}

export const ids = {
 lanscapeKinds: {
  event: 0,
  landmark: 1,
  project: 2,
  way: 3,
  ally: 4,
  trait: 5,
  prophecy: 6
 },
};

export const saveBannedItemAsync = async (id: number, name?: string) => {
 if (db == null) {
  return Promise.reject();
 }

 saveAutoSaveId(id);
 const item: BannedItem = {
  id,
  name: name ?? `禁止-${id}`,
  kingdoms: {
   ids: [],
   expansions: []
  },
  landscapes: {
   ids: [],
   kinds: {
    expansions: [],
    ids: []
   }
  }
 };

 for (const expansion of dominion.expansions) {
  if (expansion.kingdomStatus === ban) {
   item.kingdoms.expansions.push(expansion.id);
  }
  for (const pair of expansion.landscapeStatusPairArray) {
   if (pair.status === ban) {
    item.landscapes.kinds.expansions.push({ kindId: pair.kindId, expansionId: expansion.id });
   }
  }
 }

 for (const kind of dominion.landscapeKinds) {
  if (kind.landscapeStatus === ban) {
   item.landscapes.kinds.ids.push(kind.id);
  }
 }

 for (const kingdom of dominion.kingdoms) {
  if (kingdom.kingdomStatus === ban) {
   item.kingdoms.ids.push(kingdom.id);
  }
 }

 for (const landscape of dominion.landscapes) {
  if (landscape.landscapeStatus === ban) {
   item.landscapes.ids.push(landscape.id);
  }
 }

 await saveAsync(db, item);
 return item;
}