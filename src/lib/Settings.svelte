<script lang="ts">
 import { dominion } from "./dominion.svelte";
 import { globalSettings } from "./globalSettings.svelte";
 let separatorKind: "crlf" | "space" | "comma" | "text" = $state("crlf");
 let separatorText = $state("");

 $effect(() => {
  switch (separatorKind) {
   case "crlf":
    globalSettings.copyListSeparator = "\r\n";
    break;
   case "space":
    globalSettings.copyListSeparator = " ";
    break;
   case "comma":
    globalSettings.copyListSeparator = ",";
    break;
   case "text":
    globalSettings.copyListSeparator = separatorText;
    break;
  }
 });

 function resetAllBannedItem() {
  for (const item of dominion.expansions) {
   item.kingdomStatus = "random";
   item.landscapeStatus = "random";
  }

  for (const item of dominion.kingdoms) {
   item.kingdomStatus = "random";
  }

  for (const item of dominion.landscapeKinds) {
   item.landscapeStatus = "random";
  }

  for (const item of dominion.landscapes) {
   item.landscapeStatus = "random";
  }
 }

 async function saveBannedItemAsync(this: HTMLButtonElement) {
  this.disabled = true;
 }
</script>

<div>
 <h2>禁止</h2>
 <button type="button" onclick={resetAllBannedItem}>禁止要素全解除</button>
 <button type="button" onclick={saveBannedItemAsync}>禁止保存</button>
 <div>
  <span>禁止された要素の表示</span>
  <label>
   <input type="radio" name="global-settings-should-display-banned-item" value={true} bind:group={globalSettings.shouldDisplayBannedItems} checked />
   <span>表示</span>
  </label>
  <label>
   <input type="radio" name="global-settings-should-display-banned-item" value={false} bind:group={globalSettings.shouldDisplayBannedItems} />
   <span>非表示</span>
  </label>
 </div>
</div>

<div>
 <h2>コピーボタンの区切り文字</h2>
 <label>
  <input type="radio" name="global-settings-copy-separator" value="crlf" bind:group={separatorKind} checked />
  <span>改行</span>
 </label>
 <label>
  <input type="radio" name="global-settings-copy-separator" value="space" bind:group={separatorKind} />
  <span>空白</span>
 </label>
 <label>
  <input type="radio" name="global-settings-copy-separator" value="comma" bind:group={separatorKind} />
  <span>カンマ</span>
 </label>
 <label>
  <input type="radio" name="global-settings-copy-separator" value="text" bind:group={separatorKind} />
  <span>任意文字列</span>
 </label>
 <input type="text" name="global-settings-copy-separator-text" bind:value={separatorText} />
</div>

<style>
 label:has(> input[value="text"]) + input[type="text"] {
  display: none;
 }

 label:has(> input[value="text"]:checked) + input[type="text"] {
  display: unset;
 }
</style>
