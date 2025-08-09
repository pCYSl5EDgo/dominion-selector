<script lang="ts">
 import type { Snippet } from "svelte";
 import Radios, { type RadioStatus3 } from "./Radios.svelte";
 import { globalSettings } from "./globalSettings.svelte";

 let {
  text,
  isChecked = $bindable(),
  class: cls = undefined,
  name = undefined,
  disabled = false,
  children,
 }: {
  text: string;
  isChecked: RadioStatus3;
  class?: string[];
  name?: string;
  disabled?: boolean;
  children?: Snippet;
 } = $props();

 let dom: HTMLDetailsElement | undefined = $state(undefined);
 function onclick(this: HTMLButtonElement) {
  if (dom && (dom.open = !dom.open)) {
   this.scrollIntoView({ behavior: "instant", block: "start" });
  }
 }
</script>

{#if globalSettings.shouldDisplayBannedItems || isChecked !== "ban"}
 <Radios bind:isChecked {disabled}>
  <button type="button" {onclick} class={cls}>
   {text}
  </button>
 </Radios>
 <details bind:this={dom} {name}>
  <summary></summary>
  {@render children?.()}
 </details>
{/if}

<style>
 details {
  grid-column: 1/-1;
  padding: 0;
  margin: 0;
 }

 details:not(:open),
 summary:empty {
  display: none;
 }

 button {
  box-sizing: border-box;
  padding-inline: 0.8ic;
  padding-bottom: 0.3lh;
 }
</style>
