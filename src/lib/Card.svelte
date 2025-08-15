<script lang="ts">
 import type { Snippet } from "svelte";
 import { dominion } from "./dominion.svelte";
 let { id, classes = [], children }: { id: number; classes?: string[]; children: Snippet } = $props();
 let kingdom = $derived(dominion.kingdoms[id]);
</script>

<div class={kingdom.kinds.concat(...classes)}>{@render children()}</div>

<style>
 :root {
  --t: #ff9;
  --v: #9f9;
  --reaction: #c9f;
  --reserve: #aa0;
  --a: #f99;
  --d: #fc9;
  --n: #333;
 }

 .treasure {
  background-color: var(--t);

  &.victory {
   background:
    var(--t) top/100% 50% no-repeat,
    var(--v) bottom/100% 50% no-repeat;
  }

  &.reaction {
   background:
    var(--t) top/100% 50% no-repeat,
    var(--reaction) bottom/100% 50% no-repeat;
  }

  &.reserve {
   background:
    var(--t) top/100% 50% no-repeat,
    var(--reserve) bottom/100% 50% no-repeat;
  }

  &.attack {
   background:
    var(--t) top/100% 50% no-repeat,
    var(--a) bottom/100% 50% no-repeat;
  }

  &.action {
   background: var(--t) bottom/100% 50% no-repeat;
  }

  &.duration {
   background:
    var(--t) top/100% 50% no-repeat,
    var(--d) bottom/100% 50% no-repeat;
  }
 }

 .victory {
  background-color: var(--v);

  &.action {
   background: var(--v) bottom/100% 50% no-repeat;
  }

  &.reaction {
   background:
    var(--v) top/100% 50% no-repeat,
    var(--reaction) bottom/100% 50% no-repeat;
  }

  &.attack {
   background:
    var(--a) top/100% 50% no-repeat,
    var(--v) bottom/100% 50% no-repeat;
  }

  &.reserve {
   background:
    var(--reserve) top/100% 50% no-repeat,
    var(--v) bottom/100% 50% no-repeat;
  }

  &.duration {
   background:
    var(--d) top/100% 50% no-repeat,
    var(--v) bottom/100% 50% no-repeat;
  }
 }

 .reaction {
  background-color: var(--r);

  &.duration {
   background:
    var(--d) top/100% 50% no-repeat,
    var(--reaction) bottom/100% 50% no-repeat;
  }

  &.attack {
   background:
    var(--a) top/100% 50% no-repeat,
    var(--reaction) bottom/100% 50% no-repeat;
  }
 }

 .attack {
  background-color: var(--a);

  &.duration {
   background:
    var(--d) top/100% 50% no-repeat,
    var(--a) bottom/100% 50% no-repeat;
  }

  &.night {
   background:
    var(--n) top/100% 50% no-repeat,
    var(--a) bottom/100% 50% no-repeat;
  }
 }

 .duration {
  background-color: var(--d);

  &.night {
   background:
    var(--n) top/100% 50% no-repeat,
    var(--d) bottom/100% 50% no-repeat;
  }
 }

 .night {
  background-color: var(--n);
 }

 div {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-inline: 0.5ex;
  text-align: center;
 }
</style>
