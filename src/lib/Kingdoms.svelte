<script lang="ts">
 import ButtonRadioDetails from "./ButtonRadioDetails.svelte";
 import Radios from "./Radios.svelte";
 import { dominion } from "./dominion.svelte";
 import { untrack } from "svelte";
 import { supplySettings } from "./SupplySettings.svelte";
 import { globalSettings } from "./globalSettings.svelte";

 $effect(() => {
  for (const expansion of dominion.expansions) {
   const status = expansion.kingdomStatus;
   if (status === "ban") {
    untrack(() => {
     for (const kingdomId of expansion.kingdoms) {
      dominion.kingdoms[kingdomId].kingdomStatus = status;
     }
    });
   } else {
    untrack(() => {
     for (const kingdomId of expansion.kingdoms) {
      const item = dominion.kingdoms[kingdomId];
      if (item.kingdomStatus !== "ban") {
       item.kingdomStatus = status;
      }
     }
    });
   }
  }
 });

 let kingdomSelectionCountMinMax = $derived.by(() => {
  let min = 0,
   max = 0;
  for (const kingdom of dominion.kingdoms) {
   switch (kingdom.kingdomStatus) {
    case "on":
     min++;
     max++;
     break;
    case "random":
     max++;
     break;
   }
  }
  return { min, max };
 });

 $effect(() => {
  if (supplySettings.kingdomCount > kingdomSelectionCountMinMax.max) {
   supplySettings.kingdomCount = kingdomSelectionCountMinMax.max;
  } else if (supplySettings.kingdomCount < kingdomSelectionCountMinMax.min) {
   supplySettings.kingdomCount = kingdomSelectionCountMinMax.min;
  }
 });
</script>

<div>
 <label>
  <span>王国選出枚数</span>
  <input id="supply-kingdom-count" type="number" min={kingdomSelectionCountMinMax.min} max={kingdomSelectionCountMinMax.max} step="1" bind:value={supplySettings.kingdomCount} />
 </label>
</div>

{#each dominion.expansions as expansion}
 <ButtonRadioDetails text={expansion.japanese} class={["font-weight-bolder"]} bind:isChecked={expansion.kingdomStatus} name="expansion">
  <ul>
   {#each expansion.kingdoms as kingdomId}
    {@const kingdom = dominion.kingdoms[kingdomId]}
    {#if globalSettings.shouldDisplayBannedItems || kingdom.kingdomStatus !== "ban"}
     <li>
      <Radios hasOn={true} bind:isChecked={kingdom.kingdomStatus} disabled={expansion.kingdomStatus === "ban"}>
       <span class="font-weight-bold">{kingdom.japanese}</span>
      </Radios>
     </li>
    {/if}
   {/each}
  </ul>
 </ButtonRadioDetails>
{/each}

<style>
 ul {
  grid-template-columns: auto repeat(4, 1fr);
 }

 div {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.5em;
  row-gap: 0.4lh;

  > label {
   display: grid;
   grid-template-columns: subgrid;
   grid-column: 1/-1;
   column-gap: 0.5em;
   row-gap: 0.4lh;
  }
 }
</style>
