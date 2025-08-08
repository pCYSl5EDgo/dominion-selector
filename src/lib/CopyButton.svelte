<script lang="ts">
 import { type Snippet } from "svelte";
 let { text, fadeoutMilliseconds = 1000, children }: { text: string; fadeoutMilliseconds?: number; children: Snippet } = $props();
 const resultText = self?.navigator?.clipboard == null ? "コピー失敗" : "コピー完了";
 let dom: HTMLSpanElement;
 function onclick() {
  dom.classList.remove("hidden");
  self?.navigator?.clipboard?.writeText(text)?.then(() => {
   setTimeout(() => {
    dom.classList.add("hidden");
   }, fadeoutMilliseconds);
  });
 }
</script>

<div>
 <button type="button" {onclick}>
  {@render children()}
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
