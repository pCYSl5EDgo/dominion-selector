import { browser } from "$app/environment";
export type BannedItem = {
 id: number;
 name: string;
 kingdoms: number[];
 landscapes: number[];
}

let privateDbPromise: Promise<IDBDatabase>;
let privateGetAutoBannedItem: (db: IDBDatabase, abortSignal?: AbortSignal) => Promise<BannedItem>;
let privateListBannedItems = (db: IDBDatabase, abortSignal?: AbortSignal) => Promise<{ id: number, name: string }[]>;

if (browser) {
 const { promise, resolve, reject } = Promise.withResolvers();

 const openRequest = self.indexedDB.open("history", 1);
 openRequest.addEventListener("blocked", reject);
 openRequest.addEventListener("error", reject);
 const bannedItemObjectStoreName = "banned-item";
 openRequest.addEventListener("upgradeneeded", (ev: IDBVersionChangeEvent) => {
  const db = (ev.target as any).result as IDBDatabase;
  db.createObjectStore(bannedItemObjectStoreName, { keyPath: "id" });
 });

 openRequest.addEventListener("success", (ev) => resolve((ev.target as any).result as IDBDatabase));

 privateDbPromise = promise as Promise<IDBDatabase>;
 privateGetAutoBannedItem = (db: IDBDatabase, abortSignal?: AbortSignal) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  abortSignal?.addEventListener("abort", reject);
  const transaction = db.transaction(bannedItemObjectStoreName, "readonly", { durability: "relaxed" });
  transaction.addEventListener("abort", reject);
  transaction.addEventListener("error", reject);
  const store = transaction.objectStore(bannedItemObjectStoreName);

  const request = store.get(-1);
  request.addEventListener("error", reject);
  request.addEventListener("success", function (this: IDBRequest<BannedItem>) {
   resolve(this.result);
  });
  return promise as Promise<BannedItem>;
 };

 privateListBannedItems = (db: IDBDatabase, abortSignal?: AbortSignal) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  abortSignal?.addEventListener("abort", reject);
  const transaction = db.transaction(bannedItemObjectStoreName, "readonly", { durability: "relaxed" });
  transaction.addEventListener("abort", reject);
  transaction.addEventListener("error", reject);
  const result: { id: number, name: string }[] = [];
  transaction.addEventListener("complete", () => resolve(result));
  const store = transaction.objectStore(bannedItemObjectStoreName);
  const cursorRequest = store.openCursor(null, "prev");
  cursorRequest.addEventListener("error", reject);
  cursorRequest.addEventListener("success", (ev) => {
   const cursor = (ev.target as any)?.result as IDBCursorWithValue;
   if (cursor == null) {
    return;
   }

   const { id, name } = cursor.value as BannedItem;
   result.push({ id, name });
   cursor.continue();
  });

  return promise as Promise<{ id: number, name: string }[]>;
 }
}
else {
 privateDbPromise = null!;
 privateGetAutoBannedItem = null!;
 privateListBannedItems = null!;
}

export const dbPromise = privateDbPromise;
export const getAutoBannedItem = privateGetAutoBannedItem;
export const listBannedItems = privateListBannedItems;