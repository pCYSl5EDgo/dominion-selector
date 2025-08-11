<script lang="ts">
 import { initializeWithBannedItemAsync, initializeWithRandom, saveBannedItemAsync } from "./dominion.svelte";
 import { db, deleteBannedItemAsync, listBannedItemIdNamePairAsync, getAutoSaveId, saveAutoSaveId } from "./history";
 import { globalSettings, calculateSeparatorKind, shouldDisplayName, separatorName } from "./globalSettings.svelte";
 import { browser } from "$app/environment";
 import { untrack } from "svelte";
 let separatorKind: "crlf" | "space" | "comma" | "text" = $state(calculateSeparatorKind(globalSettings));
 let separatorText = $state(globalSettings.copyListSeparator);
 let bannedItems: { id: number; name: string }[] = $state([]);

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

 if (db) {
  listBannedItemIdNamePairAsync(db).then((list) => {
   bannedItems.push(...list);
  });
 }

 let selectedBannedItemId = $state(getAutoSaveId());
 function addNewBannedItemAsync(this: HTMLButtonElement) {
  if (db) {
   const dom = this;
   dom.disabled = true;
   let tempId = 0;
   for (const { id } of bannedItems) {
    if (tempId < id) {
     break;
    }

    tempId++;
   }

   saveBannedItemAsync(tempId)
    .then((item) => {
     selectedBannedItemId = tempId;
     bannedItems.push(item);
    })
    .finally(() => (dom.disabled = false));
  }
 }

 $effect(() => {
  if (browser) {
   self.localStorage.setItem(shouldDisplayName, globalSettings.shouldDisplayBannedItems ? "1" : "0");
  }
 });
 $effect(() => {
  if (browser) {
   self.localStorage.setItem(separatorName, globalSettings.copyListSeparator);
  }
 });

 $effect(() => {
  saveAutoSaveId(selectedBannedItemId);
  untrack(() => {
   if (db) {
    initializeWithBannedItemAsync(db, selectedBannedItemId);
   }
  });
 });
</script>

<div id="settings-ban">
 <h2>禁止</h2>
 <button type="button" onclick={initializeWithRandom}>禁止要素全解除</button>
 <div id="settings-banned-item-display-status">
  <h3>禁止された要素の表示</h3>
  <label>
   <input type="radio" name="global-settings-should-display-banned-item" value={true} bind:group={globalSettings.shouldDisplayBannedItems} checked />
   <span>表示</span>
  </label>
  <label>
   <input type="radio" name="global-settings-should-display-banned-item" value={false} bind:group={globalSettings.shouldDisplayBannedItems} />
   <span>非表示</span>
  </label>
 </div>
 <div id="settings-banned-item-list">
  <h3>禁止リスト</h3>
  <button type="button" onclick={addNewBannedItemAsync}>追加</button>
  <ul>
   {#each bannedItems as item, index}
    <li>
     <label>
      <input type="text" id={`banned-item-name-${item.id}`} bind:value={item.name} minlength="1" maxlength="32" />
     </label>
     <label>
      <input type="radio" name="settings-banned-item" value={item.id} bind:group={selectedBannedItemId} />
      <span>適用</span>
     </label>
     <button
      type="button"
      onclick={function (this: HTMLButtonElement) {
       const dom = this;
       dom.disabled = true;
       selectedBannedItemId = item.id;
       saveBannedItemAsync(item.id, item.name).finally(() => (dom.disabled = false));
      }}>更新</button
     >
     <button
      type="button"
      onclick={() => {
       if (db) {
        deleteBannedItemAsync(db, item.id);
        bannedItems.splice(index, 1);
       }
      }}>削除</button
     >
    </li>
   {/each}
  </ul>
 </div>
</div>

<div id="settings-copy-separator">
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
 :is(h2, h3) {
  margin-block: unset;
 }

 label:has(> input[value="text"]) + input[type="text"] {
  display: none;
 }

 label:has(> input[value="text"]:checked) + input[type="text"] {
  display: unset;
 }

 button {
  padding-inline: 1ex;
 }

 #settings-ban {
  display: flex;
  flex-direction: column;
  gap: 0.4lh;
 }

 #settings-banned-item-list {
  display: grid;
  grid-template-columns: 1fr repeat(3, auto);
  column-gap: 1ex;
  row-gap: 0.4lh;

  > :is(h3, button) {
   grid-column: 1/-1;
  }
  > ul {
   display: contents;
   box-sizing: border-box;
   > li {
    display: grid;
    grid-template-columns: subgrid;
    box-sizing: border-box;

    > label {
     display: inline-block;
     padding-inline: 1ex;
     font-size: larger;

     &:has(> input[type="text"]) {
      display: contents;

      > input {
       font-size: large;
       padding-inline: 1ex;
       padding-block: 0.5ex;
      }
     }
    }
   }
  }
 }

 #settings-banned-item-display-status {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1ex;
  > h3 {
   grid-column: 1/-1;
  }
 }

 #settings-copy-separator {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1ex;
  row-gap: 0.4lh;
  > h2 {
   grid-column: 1/-1;
  }

  > input[type="text"] {
   grid-column: 1/-1;
   padding-inline: 1ex;
   padding-block: 0.5ex;
   font-size: large;
  }
 }

 @media (width <= 400px) {
  #settings-banned-item-list {
   grid-template-columns: repeat(3, 1fr);

   input[type="text"] {
    grid-column: 1/-1;
   }
  }

  #settings-copy-separator {
   grid-template-columns: repeat(2, 1fr);
  }
 }
</style>
