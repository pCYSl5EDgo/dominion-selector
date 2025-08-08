import d from "$lib/dominion.json" with { type: "json" };
import type { RadioStatus3, RadioStatus4 } from "./Radios.svelte";
export type Expansion = (typeof d.expansions)[0] & {
 landscapeStatus: RadioStatus3;
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
for (const item of temp.expansions) {
 if (!item.landscapeStatus) {
  item.landscapeStatus = "random";
 }
 if (!item.kingdomStatus) {
  item.kingdomStatus = "random";
 }
}
for (const item of temp.kingdoms) {
 if (!item.kingdomStatus) {
  item.kingdomStatus = "random";
 }
}
for (const item of temp.landscapeKinds) {
 if (!item.landscapeStatus) {
  item.landscapeStatus = "random";
 }
}
for (const item of temp.landscapes) {
 if (!item.landscapeStatus) {
  item.landscapeStatus = "random";
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