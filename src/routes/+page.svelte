<script lang="ts" module>
 import Kingdoms from "$lib/Kingdoms.svelte";
 import Landscapes from "$lib/Landscapes.svelte";
 import Supply from "$lib/Supply.svelte";
 import Settings from "./Settings.svelte";
</script>

<main>
 <label>
  <input id="maintab-kingdom" type="radio" name="maintab" checked />
  王国
 </label>
 <label>
  <input id="maintab-landscape" type="radio" name="maintab" />
  ランドスケープ
 </label>
 <label>
  <input id="maintab-supply" type="radio" name="maintab" />
  サプライ
 </label>

 <div id="kingdoms">
  <Kingdoms />
 </div>

 <div id="landscapes">
  <Landscapes />
 </div>

 <div id="supply">
  <Supply />
 </div>

 <div id="settings">
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
  }

  summary::marker {
   content: "";
  }

  .font-weight-bolder {
   font-weight: 700;
  }

  .font-weight-bold {
   font-weight: 500;
  }
 }

 main {
  width: stretch;
  margin-inline: auto;
  max-width: 800px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1ex;
  row-gap: 0.5lh;
 }

 #kingdoms,
 #landscapes {
  display: none;
  grid-column: 1/-1;
  grid-template-columns: auto repeat(3, 1fr);
  width: stretch;
  column-gap: 1ex;
  row-gap: 0.5lh;
 }

 #supply {
  display: none;
  grid-column: 1/-1;
  width: stretch;
  flex-direction: column;
  gap: 0.4lh;
 }

 label:has(#maintab-kingdom:checked) ~ #kingdoms,
 label:has(#maintab-landscape:checked) ~ #landscapes {
  display: grid;
 }

 label:has(#maintab-supply:checked) ~ #supply {
  display: flex;
 }
</style>
