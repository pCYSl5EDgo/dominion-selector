import dominion from './index.json' with { "type": "json" }

let radioId = 0;
/**
 * @param {HTMLElement} target 
 * @param {true} [isBan]
 */
const appendRadioOffRandomTemplate = (target, isBan) => {
 const clone = document.getElementById(`radio${isBan ? "-ban" : ""}-off-random-template`).content.cloneNode(true);
 for (const input of clone.querySelectorAll(":scope>label>input")) {
  input.name = `radio-${radioId}`;
 }

 radioId++;
 target.appendChild(clone);
}

appendRadioOffRandomTemplate(document.getElementById("kingdoms"));
appendRadioOffRandomTemplate(document.getElementById("event-landscapes"));
appendRadioOffRandomTemplate(document.getElementById("normal-landscapes"));
appendRadioOffRandomTemplate(document.getElementById("unique-landscapes"));

{
 const template = document.getElementById("expansion-template").content;
 const target = document.getElementById("kingdoms");
 for (let id = 0; id < dominion.expansions.length; id++) {
  const clone = template.cloneNode(true);
  clone.firstElementChild.dataset.id = id.toString();
  const name = clone.querySelector(".expansion.name");
  name.textContent = dominion.expansions[id].japanese;
  appendRadioOffRandomTemplate(name.parentElement, true);
  target.appendChild(clone);
 }
}

{
 const template = document.getElementById("landscapes-template").content;
 {
  const target = document.getElementById("event-landscapes");
  for (const id of [9, 10, 13, 15, 16]) {
   const clone = template.cloneNode(true);
   const details = clone.querySelector("details");
   details.name = "event-landscapes";
   details.dataset.id = id.toString();
   const name = clone.querySelector(".name");
   name.classList.add("expansion");
   name.textContent = dominion.expansions[id].japanese;
   appendRadioOffRandomTemplate(name.parentElement, true);
   target.appendChild(clone);
  }
 }
 {
  const target = document.getElementById("normal-landscapes");
  for (let id = 1; id < dominion.landscapeKinds.length; id++) {
   const item = dominion.landscapeKinds[id];
   if (!item.unique) {
    const clone = template.cloneNode(true);
    const details = clone.querySelector("details");
    details.name = "normal-landscapes";
    details.dataset.id = id.toString();
    const name = clone.querySelector(".name");
    name.classList.add("landscape-kind");
    name.textContent = item.japanese;
    appendRadioOffRandomTemplate(name.parentElement, true);
    target.appendChild(clone);
   }
  }
 }
 {
  const target = document.getElementById("unique-landscapes");
  for (let id = 1; id < dominion.landscapeKinds.length; id++) {
   const item = dominion.landscapeKinds[id];
   if (item.unique) {
    const clone = template.cloneNode(true);
    const details = clone.querySelector("details");
    details.name = "unique-landscapes";
    details.dataset.id = id.toString();
    const name = clone.querySelector(".name");
    name.classList.add("landscape-kind");
    name.textContent = item.japanese;
    appendRadioOffRandomTemplate(name.parentElement, true);
    target.appendChild(clone);
   }
  }
 }
}

/** @type {DocumentFragment} */
const cardTemplate = document.getElementById("card-template").content;

{
 const rootDiv = document.getElementById("kingdoms");
 let target = rootDiv.querySelector(`details[data-id='0']>summary~div`);
 for (let id = 0, currentExpansionId = 0; id < dominion.kingdoms.length; id++) {
  const kingdom = dominion.kingdoms[id];
  if (kingdom.expansionId !== currentExpansionId) {
   currentExpansionId = kingdom.expansionId;
   target = rootDiv.querySelector(`details[data-id='${kingdom.expansionId}']>summary~div`);
  }

  /** @type {DocumentFragment} */
  const clone = cardTemplate.cloneNode(true);
  clone.firstElementChild.dataset.id = id;
  /** @type {HTMLElement} */
  const name = clone.querySelector(".name");
  name.classList.add("kingdom");
  name.textContent = kingdom.japanese;
  for (const input of clone.querySelectorAll("input")) {
   input.name = `kingdom-${id}`;
  }

  target.appendChild(clone);
 }
}

{
 for (const target of document.querySelectorAll("#event-landscapes>details[data-id]>div")) {
  const expansionId = Number.parseInt(target.parentElement.dataset.id);
  for (let id = 0; id < dominion.landscapes.length; id++) {
   const item = dominion.landscapes[id];
   if (item.kindId === 0 && item.expansionId === expansionId) {
    /** @type {DocumentFragment} */
    const clone = cardTemplate.cloneNode(true);
    clone.querySelector("[data-id]").dataset.id = id;
    const name = clone.querySelector(".name");
    name.classList.add("landscape");
    name.textContent = item.japanese;
    for (const input of clone.querySelectorAll("input")) {
     input.name = `landscape-${id}`;
    }

    target.appendChild(clone);
   }
  }
 }
}

{
 for (const target of document.querySelectorAll(":is(#normal-landscapes,#unique-landscapes)>details[data-id]>div")) {
  const kindId = Number.parseInt(target.parentElement.dataset.id);
  for (let id = 0; id < dominion.landscapes.length; id++) {
   const item = dominion.landscapes[id];
   if (item.kindId === kindId) {
    /** @type {DocumentFragment} */
    const clone = cardTemplate.cloneNode(true);
    clone.querySelector("[data-id]").dataset.id = id;
    const name = clone.querySelector(".name");
    name.classList.add("landscape");
    name.textContent = item.japanese;
    for (const input of clone.querySelectorAll("input")) {
     input.name = `landscape-${id}`;
    }

    target.appendChild(clone);
   }
  }
 }
}

/** @this {HTMLElement} */
function multipleCardSelect() {
 for (const input of this.parentElement.parentElement.parentElement.querySelectorAll(`:scope>div>div>label>input[type='radio'][value='${this.value}']`)) {
  if (!input.parentElement.parentElement.querySelector("input[type='radio'][value='ban']:checked")) {
   input.checked = true;
  }
 }
}

/** @this {HTMLElement} */
function multipleSelectorSelect() {
 for (const input of this.parentElement.parentElement.querySelectorAll(`:scope>details>summary>label>input[type='radio'][value='${this.value}']`)) {
  input.checked = true;
  input.dispatchEvent(new Event("change"));
 }
}

{
 let selectorId = 0;
 for (const selectorContainer of document.querySelectorAll("[data-selector]")) {
  const changeHandler = selectorContainer.dataset.selector === "card" ? multipleCardSelect : multipleSelectorSelect;
  for (const inputElement of selectorContainer.querySelectorAll(":scope>label>input[type='radio']")) {
   inputElement.addEventListener("change", changeHandler);
   inputElement.name = `selector-${selectorId}`;
  }

  selectorId++;
 }
}

/** @param {HTMLElement} element */
const recursiveDelete = (element) => {
 if (element.classList.contains("preserve-tree")) {
  return;
 } else if (!element.classList.contains("preserve-self")) {
  element.remove();
  return;
 }

 for (let child = element.firstElementChild; child;) {
  const next = child.nextElementSibling;
  recursiveDelete(child);
  child = next;
 }
}
const numberAscendingComparer = (left, right) => left - right;

const resetSupplyKingdoms = () => {
 const div = document.getElementById("supply-kingdoms");
 recursiveDelete(div);
 for (const element of div.getElementsByClassName("show-error")) {
  element.classList.remove("show-error");
 }
}

{
 /** @param {HTMLElement} element */
 const hasDatasetId = (element) => element?.dataset.id?.length > 0;
 document.getElementById("supply-raffle").addEventListener("click", () => {
  resetSupplyKingdoms();

  /** @type {number[]} */
  const randomIds = [];
  /** @type {number[]} */
  const selectedIds = [];
  for (const inputElement of document.querySelectorAll("#kingdoms .ban-hide[data-id] input[type='radio']:checked")) {
   const array = inputElement.value === "random" ? randomIds : inputElement.value === "on" ? selectedIds : null;
   if (array) {
    const id = Number.parseInt(recursiveFindAncestor(inputElement, hasDatasetId)?.dataset?.id);
    if (Number.isSafeInteger(id)) {
     array.push(id);
    }
   }
  }

  const target = document.getElementById("supply-kingdoms");
  const kingdomCount = Number.parseInt(document.getElementById("supply-settings-kingdoms-count").value);
  if (selectedIds.length > kingdomCount) {
   target.querySelector(":scope>[data-error-id='1']").classList.add("show-error");
   return;
  }

  if (selectedIds.length < kingdomCount) {
   const array = new Uint32Array(kingdomCount - selectedIds.length);
   if (array.length > randomIds.length) {
    target.querySelector(":scope>[data-error-id='2']").classList.add("show-error");
    return;
   }

   self.crypto.getRandomValues(array);
   for (let i = 0; i < array.length; i++) {
    const randomIndex = array.at(i) % randomIds.length;
    selectedIds.push(randomIds[randomIndex]);
    const lastValue = randomIds.pop();
    if (randomIndex !== randomIds.length) {
     randomIds[randomIndex] = lastValue;
    }
   }
  }

  const template = document.getElementById("raffle-card-template").content;
  for (const id of selectedIds.sort(numberAscendingComparer)) {
   /** @type {DocumentFragment} */
   const clone = template.cloneNode(true);
   clone.firstElementChild.dataset.id = id.toString();
   const kingdom = dominion.kingdoms[id];
   const expansion = dominion.expansions[kingdom.expansionId];
   const expansionName = clone.firstElementChild.firstElementChild;
   expansionName.dataset.id = kingdom.expansionId.toString();
   expansionName.textContent = expansion.japanese;
   const kingdomName = expansionName.nextElementSibling;
   kingdomName.classList.add("kingdom");
   kingdomName.textContent = kingdom.japanese;
   target.querySelector(":scope>div").appendChild(clone);
  }
 });
}
document.getElementById("supply-reset").addEventListener("click", resetSupplyKingdoms);

document.getElementById("settings-reset-all").addEventListener("click", () => {
 for (const inputElement of document.querySelectorAll("input[type='radio'][value='random'][name]:not(:checked)")) {
  inputElement.checked = true;
  inputElement.dispatchEvent(new Event("change"));
 }

 self.localStorage.clear();
});

/**
 * @param {string} language 
 * @param {boolean} [forceReset]
 */
function setName(language, forceReset) {
 for (const nameElement of document.getElementsByClassName("name")) {
  if (!forceReset && nameElement.textContent.length > 0) {
   continue;
  }

  let target = nameElement;
  while (target && target.dataset.id == null) {
   target = target.parentElement;
  }

  if (target == null || target.dataset.id.length === 0) {
   continue;
  }

  const id = Number.parseInt(target.dataset.id);
  if (Number.isNaN(id)) {
   continue;
  }

  const list = nameElement.classList;
  nameElement.textContent = list.contains("expansion") ? dominion.expansions[id][language]
   : list.contains("landscape-kind") ? dominion.landscapeKinds[id][language]
    : list.contains("landscape") ? dominion.landscapes[id][language]
     : list.contains("kingdom") ? dominion.kingdoms[id][language]
      : "ERROR!";
 }
}

setName("japanese");

/**
 * @param {HTMLElement} element 
 * @param {function(HTMLElement):bool} condition 
 */
function recursiveFindAncestor(element, condition) {
 while (!condition(element)) {
  element = element.parentElement;
 }

 return element;
}

document.getElementById("icons-license").addEventListener("toggle", async function () {
 this.lastElementChild.textContent = await (await fetch("./Apache%20License%20of%20Google%20Matrial%20Icons.txt")).text();
}, { once: true });
