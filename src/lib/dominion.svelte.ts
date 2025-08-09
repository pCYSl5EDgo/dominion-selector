import d from "$lib/dominion.json" with { type: "json" };
import type { RadioStatus3, RadioStatus4 } from "./Radios.svelte";
import { db, getAutoBannedItemAsync } from "./history";

export type Expansion = (typeof d.expansions)[0] & {
 landscapeStatus: { kindId: number, status: RadioStatus3 }[];
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

const temp = d as any as Dominion;
const random = "random";

for (const item of temp.expansions) {
 item.kingdomStatus = random;
 item.landscapeStatus = item.landscapeKinds.map(kindId => { return { kindId, status: random } });
}

for (const item of temp.landscapeKinds) {
 item.landscapeStatus = random;
}

for (const item of temp.kingdoms) {
 item.kingdomStatus = random;
}

for (const item of temp.landscapes) {
 item.landscapeStatus = random;
}

if (db) {
 const ban = "ban";
 const bannedItem = await getAutoBannedItemAsync(db);
 if (bannedItem) {
  for (const expansionId of bannedItem.kingdoms.expansions) {
   const expansion = temp.expansions[expansionId];
   expansion.kingdomStatus = ban;
   for (const kingdomId of expansion.kingdoms) {
    temp.kingdoms[kingdomId].kingdomStatus = ban;
   }
  }

  for (const kingdomId of bannedItem.kingdoms.ids) {
   temp.kingdoms[kingdomId].kingdomStatus = ban;
  }

  for (const kindId of bannedItem.landscapes.kinds.ids) {
   const kind = temp.landscapeKinds[kindId];
   kind.landscapeStatus = ban;
   for (const landscapeId of kind.landscapes) {
    temp.landscapes[landscapeId].landscapeStatus = ban;
   }
  }

  for (const { kindId, expansionId } of bannedItem.landscapes.kinds.expansions) {
   const expansion = temp.expansions[expansionId];
   for (const pair of expansion.landscapeStatus) {
    if (pair.kindId === kindId) {
     pair.status = ban;
    }
   }
  }

  for (const landscapeId of bannedItem.landscapes.ids) {
   temp.landscapes[landscapeId].landscapeStatus = ban;
  }
 }
}

export const dominion = $state(temp);
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