<script lang="ts">
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
</script>

<fieldset>
 <legend>禁止された要素の表示</legend>
 <label>
  <input type="radio" name="global-settings-should-display-banned-item" value={true} bind:group={globalSettings.shouldDisplayBannedItems} checked />
  <span>表示</span>
 </label>
 <label>
  <input type="radio" name="global-settings-should-display-banned-item" value={false} bind:group={globalSettings.shouldDisplayBannedItems} />
  <span>非表示</span>
 </label>
</fieldset>

<fieldset>
 <legend>コピーボタンの区切り文字</legend>
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
</fieldset>

<style>
 label:has(> input[value="text"]) + input[type="text"] {
  display: none;
 }

 label:has(> input[value="text"]:checked) + input[type="text"] {
  display: unset;
 }
</style>
