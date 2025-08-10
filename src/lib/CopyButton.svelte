<script lang="ts">
 import { browser } from "$app/environment";
 import { assets } from "$app/paths";
 import { type Snippet } from "svelte";

 let { text, fadeoutMilliseconds = 1000, children }: { text: string; fadeoutMilliseconds?: number; children: Snippet } = $props();
 let resultText: string = $derived.by(() => (browser && self?.navigator?.clipboard != null ? "コピー成功" : "コピー失敗"));
 let dom: HTMLSpanElement;
 const onclick = () => {
  if (browser) {
   dom.classList.remove("hidden");
   self?.navigator?.clipboard?.writeText(text)?.then(() => {
    setTimeout(() => {
     dom.classList.add("hidden");
    }, fadeoutMilliseconds);
   });
  }
 };
</script>

<div>
 <button type="button" {onclick}>
  {@render children()}
  <svg width="24" height="24">
   <use href={`${assets}/icons.svg#copy_content`}></use>
  </svg>
 </button>
 <span class="hidden" bind:this={dom}>{resultText}</span>
</div>

<style>
 div {
  display: flex;
  flex-direction: row;
  gap: 0.5ex;
 }

 span.hidden {
  display: none;
  width: max-content;
  text-wrap: balance;
 }
</style>
