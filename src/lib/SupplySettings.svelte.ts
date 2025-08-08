export type SupplySettings = {
 kingdomCount: number;
 normalLandscapeCount: number;
 wayMaxCount: number;
 allyCount: number;
 prophecyCount: number;
};

export const supplySettings: SupplySettings = $state({
 kingdomCount: 10,
 normalLandscapeCount: 2,
 wayMaxCount: 1,
 allyCount: 1,
 prophecyCount: 1,
});