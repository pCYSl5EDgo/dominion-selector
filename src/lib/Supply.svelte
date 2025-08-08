<script lang="ts">
 import CopyButton from "./CopyButton.svelte";
 import { supplySettings } from "./SupplySettings.svelte";
 import { dominion, ids } from "./dominion.svelte";
 import { globalSettings } from "./globalSettings.svelte";
 let kingdomIds: number[] = $state([]);
 let landscapeIds: number[] = $state([]);
 let allyIds: number[] = $state([]);
 let prophecyIds: number[] = $state([]);

 function isValidKingdoms(validArray: number[], additionalArray: number[]): boolean {
  return true;
 }

 function isValidNormalLandscapes(validArray: number[], additionalArray: number[]): boolean {
  let wayCount = 0;
  for (const id of validArray) {
   if (dominion.landscapes[id].kindId === ids.lanscapeKinds.way) {
    ++wayCount;
   }
  }

  for (const id of additionalArray) {
   if (dominion.landscapes[id].kindId === ids.lanscapeKinds.way) {
    if (++wayCount > supplySettings.wayMaxCount) {
     return false;
    }
   }
  }

  return true;
 }

 function isValidAllies(validArray: number[], additionalArray: number[]): boolean {
  return true;
 }

 function isValidProphecies(validArray: number[], additionalArray: number[]): boolean {
  return true;
 }

 function calculateKingdoms() {
  kingdomIds.length = 0;
  const candidates: number[] = [];
  for (const item of dominion.kingdoms) {
   if (item.kingdomStatus === "on") {
    kingdomIds.push(item.id);
   } else if (item.kingdomStatus === "random") {
    candidates.push(item.id);
   }
  }

  if (kingdomIds.length + candidates.length < supplySettings.kingdomCount) {
   kingdomIds.length = 0;
   return;
  }

  const selectedIds: number[] = [];
  while (supplySettings.kingdomCount > kingdomIds.length) {
   selectRandomIds(window.structuredClone(candidates), selectedIds, supplySettings.kingdomCount - kingdomIds.length);
   if (isValidKingdoms(kingdomIds, selectedIds)) {
    kingdomIds.push(...selectedIds);
   }
  }

  kingdomIds.sort();
 }

 function generateCandidates(ids: Iterable<number>, targetArray: number[]): number[] {
  const candidates: number[] = [];
  for (const id of ids) {
   switch (dominion.landscapes[id].landscapeStatus) {
    case "on":
     targetArray.push(id);
     break;
    case "random":
     candidates.push(id);
     break;
   }
  }

  return candidates;
 }

 function calculateNormalLandscapes() {
  landscapeIds.length = 0;
  const candidates = generateCandidates(
   dominion.landscapes.filter((value) => value.kindId !== ids.lanscapeKinds.ally && value.kindId !== ids.lanscapeKinds.prophecy).map((value) => value.id),
   landscapeIds,
  );
  if (landscapeIds.length + candidates.length < supplySettings.normalLandscapeCount) {
   landscapeIds.length = 0;
   return;
  }

  const selectedIds: number[] = [];
  while (supplySettings.normalLandscapeCount > landscapeIds.length) {
   selectRandomIds(window.structuredClone(candidates), selectedIds, supplySettings.normalLandscapeCount - landscapeIds.length);
   if (isValidNormalLandscapes(landscapeIds, selectedIds)) {
    landscapeIds.push(...selectedIds);
   }
  }

  landscapeIds.sort();
 }

 function calculateAllies() {
  allyIds.length = 0;
  const candidates = generateCandidates(dominion.landscapeKinds[ids.lanscapeKinds.ally].landscapes, allyIds);
  if (allyIds.length + candidates.length < supplySettings.allyCount) {
   allyIds.length = 0;
   return;
  }

  const selectedIds: number[] = [];
  while (supplySettings.allyCount > allyIds.length) {
   selectRandomIds(window.structuredClone(candidates), selectedIds, supplySettings.allyCount - allyIds.length);
   if (isValidAllies(allyIds, selectedIds)) {
    allyIds.push(...selectedIds);
   }
  }

  allyIds.sort();
 }

 function calculateProphecies() {
  prophecyIds.length = 0;
  const candidates = generateCandidates(dominion.landscapeKinds[ids.lanscapeKinds.prophecy].landscapes, prophecyIds);
  if (prophecyIds.length + candidates.length < supplySettings.prophecyCount) {
   prophecyIds.length = 0;
   return;
  }

  const selectedIds: number[] = [];
  while (supplySettings.prophecyCount > prophecyIds.length) {
   selectRandomIds(window.structuredClone(candidates), selectedIds, supplySettings.prophecyCount - prophecyIds.length);
   if (isValidAllies(prophecyIds, selectedIds)) {
    prophecyIds.push(...selectedIds);
   }
  }

  prophecyIds.sort();
 }

 function selectRandomIds(candidates: number[], selectedIds: number[], requiredCount: number) {
  selectedIds.length = 0;
  while (selectedIds.length < requiredCount) {
   const index = Math.floor(Math.random() * candidates.length);
   selectedIds.push(candidates[index]);
   candidates[index] = candidates[candidates.length - 1];
   candidates.length--;
  }
 }

 function select() {
  if (supplySettings.kingdomCount > 0) {
   calculateKingdoms();
  }

  if (supplySettings.normalLandscapeCount > 0) {
   calculateNormalLandscapes();
  }

  if (supplySettings.allyCount > 0) {
   calculateAllies();
  }

  if (supplySettings.prophecyCount > 0) {
   calculateProphecies();
  }
 }

 function reset() {
  kingdomIds.length = 0;
  landscapeIds.length = 0;
  allyIds.length = 0;
  prophecyIds.length = 0;
 }

 let kingdomCopyText = $derived.by(() => kingdomIds.map((id) => dominion.kingdoms[id].japanese).join(globalSettings.copyListSeparator));
 let landscapeCopyText = $derived.by(() => landscapeIds.map((id) => dominion.landscapes[id].japanese).join(globalSettings.copyListSeparator));
 let allyCopyText = $derived.by(() => allyIds.map((id) => dominion.landscapes[id].japanese).join(globalSettings.copyListSeparator));
 let prophecyCopyText = $derived.by(() => prophecyIds.map((id) => dominion.landscapes[id].japanese).join(globalSettings.copyListSeparator));
</script>

<div>
 <button type="button" onclick={select}>選出</button>
 <button type="button" onclick={reset}>リセット</button>
</div>

{#if supplySettings.kingdomCount > 0}
 <CopyButton text={kingdomCopyText}>
  <span class="font-weight-bold">王国 (クリックしてコピー可)</span>
 </CopyButton>
 <ul class="grid2">
  {#each kingdomIds as id}
   {@const item = dominion.kingdoms[id]}
   <li class={item.kingdomStatus}>
    <span>{dominion.expansions[item.expansionId].japanese}</span>
    <span>{item.japanese}</span>
   </li>
  {/each}
 </ul>
{/if}

{#if supplySettings.normalLandscapeCount > 0}
 <CopyButton text={landscapeCopyText}>
  <span class="font-weight-bold">ランドスケープ (クリックしてコピー可)</span>
 </CopyButton>
 <ul class="grid3">
  {#each landscapeIds as id}
   {@const item = dominion.landscapes[id]}
   <li class={item.landscapeStatus}>
    <span>{dominion.landscapeKinds[item.kindId].japanese}</span>
    <span>{dominion.expansions[item.expansionId].japanese}</span>
    <span>{item.japanese}</span>
   </li>
  {/each}
 </ul>
{/if}

{#if supplySettings.allyCount > 0}
 <CopyButton text={allyCopyText}>
  <span class="font-weight-bold">同盟</span>
 </CopyButton>
 <ul class="grid1">
  {#each allyIds as id}
   {@const item = dominion.landscapes[id]}
   <li class={item.landscapeStatus}>
    <span>{item.japanese}</span>
   </li>
  {/each}
 </ul>
{/if}

{#if supplySettings.prophecyCount > 0}
 <CopyButton text={prophecyCopyText}>
  <span class="font-weight-bold">予言</span>
 </CopyButton>
 <ul class="grid1">
  {#each prophecyIds as id}
   {@const item = dominion.landscapes[id]}
   <li class={item.landscapeStatus}>
    <span>{item.japanese}</span>
   </li>
  {/each}
 </ul>
{/if}

<style>
 div:first-of-type {
  display: flex;
  flex-direction: row;
  gap: 0.3lh;
 }

 ul:is(.grid1, .grid2, .grid3) {
  width: stretch;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8ic, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(min-content, max-content));

  > li {
   grid-template-rows: subgrid;
   display: grid;
   padding: 4px;
   width: stretch;
   box-sizing: border-box;

   span {
    display: inline-block;
    box-sizing: border-box;
   }

   &.on {
    box-shadow: inset 0 0 0 3px orange;
   }

   &.random {
    box-shadow: inset 0 0 0 2px grey;
   }
  }
 }

 ul:empty {
  display: none;
 }

 .grid2 > li {
  grid-column: span 1;
  grid-row: span 2;
  grid-template-rows: repeat(2, auto);
 }

 .grid3 > li {
  grid-column: span 1;
  grid-row: span 3;
  grid-template-rows: repeat(3, auto);
 }
</style>
