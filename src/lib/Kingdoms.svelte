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

<details>
 <summary>選出詳細条件</summary>
 <div>
  <label>
   <span>王国選出枚数</span>
   <input id="supply-kingdom-count" type="number" min={kingdomSelectionCountMinMax.min} max={kingdomSelectionCountMinMax.max} step="1" bind:value={supplySettings.kingdomCount} />
  </label>
  <Radios bind:isChecked={supplySettings.attackSelectionStatus} hasOn={true} hasBan={false}><span>アタックカード</span></Radios>
  <Radios bind:isChecked={supplySettings.plusActionSelectionStats} hasOn={true} hasBan={false}><span>＋アクション</span></Radios>
  <Radios bind:isChecked={supplySettings.plusPurchaseSelectionStatus} hasOn={true} hasBan={false}><span>＋購入</span></Radios>
  <Radios bind:isChecked={supplySettings.compressSelectionStatus} hasOn={true} hasBan={false}><span>圧縮</span></Radios>
  <Radios bind:isChecked={supplySettings.distributeCurseSelectionStatus} hasOn={true} hasBan={false}><span>呪い撒き</span></Radios>
 </div>
</details>

{#each dominion.expansions as expansion}
 <ButtonRadioDetails text={expansion.japanese} class={["font-weight-bolder"]} bind:isChecked={expansion.kingdomStatus} name="expansion">
  <ul>
   {#each expansion.kingdoms as kingdomId}
    {@const kingdom = dominion.kingdoms[kingdomId]}
    {#if globalSettings.shouldDisplayBannedItems || kingdom.kingdomStatus !== "ban"}
     <li>
      <Radios hasOn={true} bind:isChecked={kingdom.kingdomStatus} disabled={expansion.kingdomStatus === "ban"}>
       <span class="font-weight-bold {kingdom.kinds}">{kingdom.japanese}</span>
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

 details {
  grid-column: 1/-1;

  summary::marker {
   content: unset;
  }

  > div {
   width: stretch;
   display: grid;
   grid-column: 1/-1;
   grid-template-columns: auto repeat(3, 1fr);
   row-gap: 0.4lh;
   column-gap: 1ex;
   > label:has(input[type="number"]) {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: subgrid;

    > input {
     grid-column: 2/-1;
    }
   }
  }
 }

 .treasure {
  background-color: #ff9;
 }

 .victory {
  background-color: #9f9;
 }

 .curse {
  background-color: #c9f;
 }

 .reaction {
  background-color: #99f;
 }

 .attack {
  background-color: #f99;
 }

 .duration {
  background-color: #fc9;
 }

 .shelter {
  background-color: #fcf;
 }

 .ruins {
  background-color: "#c99";
 }
</style>
