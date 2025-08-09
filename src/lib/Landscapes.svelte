<script lang="ts">
 import Radios from "./Radios.svelte";
 import ButtonRadioDetails from "./ButtonRadioDetails.svelte";
 import { dominion, ids } from "./dominion.svelte";
 import { supplySettings } from "./SupplySettings.svelte";
 import { untrack } from "svelte";
 import { globalSettings } from "./globalSettings.svelte";
 $effect(() => {
  for (const kind of dominion.landscapeKinds) {
   const status = kind.landscapeStatus;
   if (status === "ban") {
    untrack(() => {
     for (const id of kind.expansions) {
      for (const pair of dominion.expansions[id].landscapeStatus) {
       if (pair.kindId === id) {
        pair.status = status;
        break;
       }
      }
     }
     for (const id of kind.landscapes) {
      const item = dominion.landscapes[id];
      if (item.kindId === kind.id) {
       item.landscapeStatus = status;
      }
     }
    });
   } else {
    untrack(() => {
     for (const id of kind.expansions) {
      const item = dominion.expansions[id];
      for (const pair of item.landscapeStatus) {
       if (pair.kindId === kind.id && pair.status !== "ban") {
        pair.status = status;
        break;
       }
      }
     }
     for (const id of kind.landscapes) {
      const item = dominion.landscapes[id];
      if (item.kindId === kind.id && item.landscapeStatus !== "ban") {
       item.landscapeStatus = status;
      }
     }
    });
   }
  }
 });

 let landscapeSelectionCountMinMax = $derived.by(() => {
  let max = 0,
   min = 0;
  for (const item of dominion.landscapes) {
   if (item.kindId !== ids.lanscapeKinds.ally && item.kindId !== ids.lanscapeKinds.prophecy) {
    switch (item.landscapeStatus) {
     case "on":
      min++;
      max++;
      break;
     case "random":
      max++;
      break;
    }
   }
  }

  return { max, min };
 });
 let waySelectionCountMinMax = $derived.by(() => {
  let max = 0,
   min = 0;
  for (const id of dominion.landscapeKinds[ids.lanscapeKinds.way].landscapes) {
   switch (dominion.landscapes[id].landscapeStatus) {
    case "on":
     min++;
     max++;
     break;
    case "random":
     max++;
     break;
   }
  }
  return { max, min };
 });
 let allySelectionCountMinMax = $derived.by(() => {
  let max = 0,
   min = 0;
  for (const id of dominion.landscapeKinds[ids.lanscapeKinds.ally].landscapes) {
   switch (dominion.landscapes[id].landscapeStatus) {
    case "on":
     min++;
     max++;
     break;
    case "random":
     max++;
     break;
   }
  }
  return { max, min };
 });
 let prophecySelectionCountMinMax = $derived.by(() => {
  let max = 0,
   min = 0;
  for (const id of dominion.landscapeKinds[ids.lanscapeKinds.prophecy].landscapes) {
   switch (dominion.landscapes[id].landscapeStatus) {
    case "on":
     min++;
     max++;
     break;
    case "random":
     max++;
     break;
   }
  }
  return { max, min };
 });
 $effect(() => {
  if (supplySettings.normalLandscapeCount > landscapeSelectionCountMinMax.max) {
   supplySettings.normalLandscapeCount = landscapeSelectionCountMinMax.max;
  } else if (supplySettings.normalLandscapeCount < landscapeSelectionCountMinMax.min) {
   supplySettings.normalLandscapeCount = landscapeSelectionCountMinMax.min;
  }
 });
 $effect(() => {
  if (supplySettings.wayMaxCount > waySelectionCountMinMax.max) {
   supplySettings.wayMaxCount = waySelectionCountMinMax.max;
  } else if (supplySettings.wayMaxCount < waySelectionCountMinMax.min) {
   supplySettings.wayMaxCount = waySelectionCountMinMax.min;
  }
 });
 $effect(() => {
  if (supplySettings.allyCount > allySelectionCountMinMax.max) {
   supplySettings.allyCount = allySelectionCountMinMax.max;
  } else if (supplySettings.allyCount < allySelectionCountMinMax.min) {
   supplySettings.allyCount = allySelectionCountMinMax.min;
  }
 });
 $effect(() => {
  if (supplySettings.prophecyCount > prophecySelectionCountMinMax.max) {
   supplySettings.prophecyCount = prophecySelectionCountMinMax.max;
  } else if (supplySettings.prophecyCount < prophecySelectionCountMinMax.min) {
   supplySettings.prophecyCount = prophecySelectionCountMinMax.min;
  }
 });
</script>

<div>
 {#if landscapeSelectionCountMinMax.min <= landscapeSelectionCountMinMax.max && landscapeSelectionCountMinMax.max > 0}
  <label>
   <span>ランドスケープ選出枚数</span>
   <input
    id="supply-normal-landscape-count"
    type="number"
    min={landscapeSelectionCountMinMax.min}
    max={landscapeSelectionCountMinMax.max}
    step="1"
    bind:value={supplySettings.normalLandscapeCount}
    disabled={landscapeSelectionCountMinMax.min == landscapeSelectionCountMinMax.max}
   />
  </label>
 {/if}
 {#if waySelectionCountMinMax.min <= waySelectionCountMinMax.max && waySelectionCountMinMax.max > 0}
  <label>
   <span>習性選出枚数</span>
   <input
    id="supply-way-count"
    type="number"
    min={waySelectionCountMinMax.min}
    max={waySelectionCountMinMax.max}
    step="1"
    bind:value={supplySettings.wayMaxCount}
    disabled={waySelectionCountMinMax.min == waySelectionCountMinMax.max}
   />
  </label>
 {/if}
 {#if allySelectionCountMinMax.min <= allySelectionCountMinMax.max && allySelectionCountMinMax.max > 0}
  <label>
   <span>同盟選出枚数</span>
   <input
    id="supply-ally-count"
    type="number"
    min={allySelectionCountMinMax.min}
    max={allySelectionCountMinMax.max}
    step="1"
    bind:value={supplySettings.allyCount}
    disabled={allySelectionCountMinMax.min == allySelectionCountMinMax.max}
   />
  </label>
 {/if}
 {#if prophecySelectionCountMinMax.min <= prophecySelectionCountMinMax.max && prophecySelectionCountMinMax.max > 0}
  <label>
   <span>予言選出枚数</span>
   <input
    id="prophecy-way-count"
    type="number"
    min={prophecySelectionCountMinMax.min}
    max={prophecySelectionCountMinMax.max}
    step="1"
    bind:value={supplySettings.prophecyCount}
    disabled={prophecySelectionCountMinMax.min == prophecySelectionCountMinMax.max}
   />
  </label>
 {/if}
</div>

{#each dominion.landscapeKinds as kind}
 {#if kind.expansions.length === 1}
  {@const expansion = dominion.expansions[kind.expansions[0]]}
  <ButtonRadioDetails text={`${kind.japanese} - ${expansion.japanese}`} class={["font-weight-bolder"]} bind:isChecked={kind.landscapeStatus} name="landscape-kind">
   <ul class="status4">
    {#each kind.landscapes as landscapeId}
     {@const landscape = dominion.landscapes[landscapeId]}
     {#if globalSettings.shouldDisplayBannedItems || landscape.landscapeStatus !== "ban"}
      <li>
       <Radios hasOn={true} bind:isChecked={landscape.landscapeStatus} disabled={kind.landscapeStatus === "ban"}>
        <span class="font-weight-bold">{landscape.japanese}</span>
       </Radios>
      </li>
     {/if}
    {/each}
   </ul>
  </ButtonRadioDetails>
 {:else}
  <ButtonRadioDetails text={kind.japanese} class={["font-weight-bolder"]} bind:isChecked={kind.landscapeStatus} name="landscape-kind">
   <ul class="status3">
    {#each kind.expansions as expansionId}
     {@const expansion = dominion.expansions[expansionId]}
     {@const pair = expansion.landscapeStatus.find((x) => x.kindId === kind.id)}
     {#if pair && (globalSettings.shouldDisplayBannedItems || pair.status !== "ban")}
      <li>
       <ButtonRadioDetails text={expansion.japanese} class={["font-weight-bolder"]} bind:isChecked={pair.status} name="expansion" disabled={kind.landscapeStatus === "ban"}>
        <ul class="status4">
         {#each kind.landscapes as landscapeId}
          {@const landscape = dominion.landscapes[landscapeId]}
          {#if landscape.expansionId === expansionId && (globalSettings.shouldDisplayBannedItems || landscape.landscapeStatus !== "ban")}
           <li>
            <Radios hasOn={true} bind:isChecked={landscape.landscapeStatus} disabled={kind.landscapeStatus === "ban"}>
             <span class="font-weight-bold">{landscape.japanese}</span>
            </Radios>
           </li>
          {/if}
         {/each}
        </ul>
       </ButtonRadioDetails>
      </li>
     {/if}
    {/each}
   </ul>
  </ButtonRadioDetails>
 {/if}
{/each}

<style>
 .status4 {
  grid-template-columns: auto repeat(4, 1fr);
 }

 .status3 {
  grid-template-columns: auto repeat(3, 1fr);
 }

 div {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  column-gap: 0.5em;
  row-gap: 0.4lh;

  > label {
   grid-template-columns: subgrid;
   grid-column: span 2;
   display: grid;
   column-gap: 0.5em;
  }
 }
</style>
