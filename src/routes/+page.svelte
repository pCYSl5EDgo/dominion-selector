<script lang="ts" module>
 import Kingdoms from "$lib/Kingdoms.svelte";
 import Landscapes from "$lib/Landscapes.svelte";
 import Supply from "../lib/Supply.svelte";
 import Settings from "$lib/Settings.svelte";
 import { assets } from "$app/paths";
</script>

<svelte:head>
 <title>どみにおん・せれくた</title>
</svelte:head>

<main>
 <label>
  <input id="maintab-kingdom" type="radio" name="maintab" checked />
  王国
 </label>
 <label>
  <input id="maintab-landscape" type="radio" name="maintab" />
  ランドスケープ
 </label>
 <button type="button" popovertarget="supply">サプライ</button>
 <button type="button" popovertarget="settings"><span>設定</span><svg width="24" height="24"><use href={`${assets}/icons.svg#settings`}></use></svg></button>

 <div id="kingdoms">
  <Kingdoms />
 </div>

 <div id="landscapes">
  <Landscapes />
 </div>

 <div id="supply" popover>
  <Supply />
 </div>

 <div id="settings" popover>
  <Settings />
 </div>
</main>

<style>
 :global {
  label:has(> input:is([type="radio"], [type="checkbox"])) {
   background-color: black;
   color: white;
   padding: 4px;
   text-wrap: balance;
   text-align: center;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;

   > input {
    display: none;
   }

   &:has(input:checked) {
    background-color: aquamarine;
    color: unset;
   }
  }

  ul {
   margin: 0;
   padding: 0;
   padding: unset;
   display: grid;
   grid-column: 1/-1;
   column-gap: 1ex;
   row-gap: 0.2lh;
   width: stretch;

   > li {
    list-style-type: none;
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
    column-gap: 1ex;
    row-gap: 0.2lh;
    height: stretch;

    > span {
     text-wrap: balance;
    }
   }
  }

  button {
   all: unset;
   width: stretch;
   text-align: center;
   font-size: larger;
   box-shadow: inset 0 0 0 2px lightblue;
   box-sizing: border-box;
   padding: 4px;

   > span + svg {
    vertical-align: sub;
   }

   &:hover {
    cursor: pointer;
   }

   &:active {
    background-color: gray;
   }
  }

  summary {
   cursor: pointer;

   &::marker {
    content: "";
   }
  }

  .font-weight-bolder {
   font-weight: 700;
  }

  .font-weight-bold {
   font-weight: 500;
  }

  div[popover] {
   max-width: 780px;
   width: stretch;
   box-sizing: border-box;
   margin-block: 2lh;
   margin-inline: auto;
   &::backdrop {
    background-color: #8886;
   }
  }
 }

 main {
  width: stretch;
  margin-inline: auto;
  max-width: 800px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1ex;
  row-gap: 0.4lh;
 }

 #supply {
  flex-direction: column;
  gap: 0.4lh;

  &:popover-open {
   display: flex;
  }
 }

 #kingdoms,
 #landscapes {
  display: none;
  grid-column: 1/-1;
  width: stretch;
  column-gap: 1ex;
  row-gap: 0.4lh;
  flex-direction: column;
  gap: 0.4lh;
 }

 label:has(#maintab-kingdom:checked) ~ #kingdoms,
 label:has(#maintab-landscape:checked) ~ #landscapes {
  display: grid;
  grid-template-columns: auto repeat(3, 1fr);
 }
</style>
