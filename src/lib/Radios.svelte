<script lang="ts" module>
 export type RadioStatus3 = "random" | "off" | "ban";
 export type RadioStatus4 = "on" | RadioStatus3;
 // svelte-ignore non_reactive_update
 let nameId = 0;
</script>

<script lang="ts">
 import type { Snippet } from "svelte";
 import { globalSettings } from "./globalSettings.svelte";

 let {
  hasOn = false,
  isChecked = $bindable("random"),
  children = undefined,
 }: {
  hasOn?: boolean;
  isChecked: RadioStatus4;
  children?: Snippet;
 } = $props();
 const name = `Radios-${nameId++}`;
</script>

{#if globalSettings.shouldDisplayBannedItems || isChecked !== "ban"}
 {@render children?.()}
 {#if hasOn}
  <label>
   <input type="radio" value="on" bind:group={isChecked} {name} />
   <span>オン</span>
  </label>
 {/if}
 <label>
  <input type="radio" value="random" bind:group={isChecked} {name} checked />
  <span>ランダム</span>
 </label>
 <label>
  <input type="radio" value="off" bind:group={isChecked} {name} />
  <span>オフ</span>
 </label>
 <label>
  <input type="radio" value="ban" bind:group={isChecked} {name} />
  <span>禁止</span>
 </label>
{/if}
