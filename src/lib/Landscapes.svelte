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
      dominion.expansions[id].landscapeStatus = status;
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
      if (item.landscapeStatus !== "ban") {
       item.landscapeStatus = status;
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

 for (const kind of dominion.landscapeKinds) {
  for (const expansionId of kind.expansions) {
   const expansion = dominion.expansions[expansionId];
   $effect(() => {
    const status = expansion.landscapeStatus;
    if (status === "ban") {
     untrack(() => {
      for (const id of expansion.landscapes) {
       const item = dominion.landscapes[id];
       if (item.kindId === kind.id) {
        item.landscapeStatus = "ban";
       }
      }
     });
    } else {
     for (const id of expansion.landscapes) {
      const item = dominion.landscapes[id];
      if (item.kindId === kind.id && item.landscapeStatus !== "ban") {
       item.landscapeStatus = status;
      }
     }
    }
   });
  }
 }

 let landscape = $derived.by(() => {
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
 let way = $derived.by(() => {
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
 let ally = $derived.by(() => {
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
 let prophecy = $derived.by(() => {
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
  if (supplySettings.normalLandscapeCount > landscape.max) {
   supplySettings.normalLandscapeCount = landscape.max;
  } else if (supplySettings.normalLandscapeCount < landscape.min) {
   supplySettings.normalLandscapeCount = landscape.min;
  }
  $inspect(supplySettings.normalLandscapeCount, landscape.max).with(console.debug);
 });
 $effect(() => {
  if (supplySettings.wayMaxCount > way.max) {
   supplySettings.wayMaxCount = way.max;
  } else if (supplySettings.wayMaxCount < way.min) {
   supplySettings.wayMaxCount = way.min;
  }
 });
 $effect(() => {
  if (supplySettings.allyCount > ally.max) {
   supplySettings.allyCount = ally.max;
  } else if (supplySettings.allyCount < ally.min) {
   supplySettings.allyCount = ally.min;
  }
 });
 $effect(() => {
  if (supplySettings.prophecyCount > prophecy.max) {
   supplySettings.prophecyCount = prophecy.max;
  } else if (supplySettings.prophecyCount < prophecy.min) {
   supplySettings.prophecyCount = prophecy.min;
  }
 });
</script>

<div>
 {#if landscape.min <= landscape.max && landscape.max > 0}
  <label>
   <span>ランドスケープ選出枚数</span>
   <input
    id="supply-normal-landscape-count"
    type="number"
    min={landscape.min}
    max={landscape.max}
    step="1"
    bind:value={supplySettings.normalLandscapeCount}
    disabled={landscape.min == landscape.max}
   />
  </label>
 {/if}
 {#if way.min <= way.max && way.max > 0}
  <label>
   <span>習性選出枚数</span>
   <input id="supply-way-count" type="number" min={way.min} max={way.max} step="1" bind:value={supplySettings.wayMaxCount} disabled={way.min == way.max} />
  </label>
 {/if}
 {#if ally.min <= ally.max && ally.max > 0}
  <label>
   <span>同盟選出枚数</span>
   <input id="supply-ally-count" type="number" min={ally.min} max={ally.max} step="1" bind:value={supplySettings.allyCount} disabled={ally.min == ally.max} />
  </label>
 {/if}
 {#if prophecy.min <= prophecy.max && prophecy.max > 0}
  <label>
   <span>予言選出枚数</span>
   <input id="prophecy-way-count" type="number" min={prophecy.min} max={prophecy.max} step="1" bind:value={supplySettings.prophecyCount} disabled={prophecy.min == prophecy.max} />
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
     {#if globalSettings.shouldDisplayBannedItems || expansion.landscapeStatus !== "ban"}
      <li>
       <ButtonRadioDetails
        text={expansion.japanese}
        class={["font-weight-bolder"]}
        bind:isChecked={expansion.landscapeStatus}
        name="expansion"
        disabled={kind.landscapeStatus === "ban"}
       >
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
