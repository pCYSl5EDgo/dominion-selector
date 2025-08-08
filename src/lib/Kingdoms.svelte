<script lang="ts">
 import ButtonRadioDetails from "./ButtonRadioDetails.svelte";
 import Radios from "./Radios.svelte";
 import { dominion } from "./dominion.svelte";
 import { untrack } from "svelte";
 import { supplySettings } from "./SupplySettings.svelte";

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

 let kingdom = $derived.by(() => {
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
  if (supplySettings.kingdomCount > kingdom.max) {
   supplySettings.kingdomCount = kingdom.max;
  } else if (supplySettings.kingdomCount < kingdom.min) {
   supplySettings.kingdomCount = kingdom.min;
  }
 });
</script>

<div>
 <label>
  <span>王国選出枚数</span>
  <input id="supply-kingdom-count" type="number" min={kingdom.min} max={kingdom.max} step="1" bind:value={supplySettings.kingdomCount} />
 </label>
</div>

{#each dominion.expansions as expansion}
 <ButtonRadioDetails text={expansion.japanese} class={["font-weight-bolder"]} bind:isChecked={expansion.kingdomStatus} name="expansion">
  <ul>
   {#each expansion.kingdoms as kingdomId}
    {@const kingdom = dominion.kingdoms[kingdomId]}
    <li>
     <Radios hasOn={true} bind:isChecked={kingdom.kingdomStatus}>
      <span class="font-weight-bold">{kingdom.japanese}</span>
     </Radios>
    </li>
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
