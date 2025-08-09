import { browser } from "$app/environment";
export type BannedItem = {
 id: number;
 name: string;
 kingdoms: {
  expansions: number[];
  ids: number[];
 };
 landscapes: {
  kinds: {
   expansions: number[];
   ids: number[];
  };
  ids: number[];
 };
}

let privateDbPromise: Promise<IDBDatabase>;
let getAutoBannedItem: (db: IDBDatabase, abortSignal?: AbortSignal) => Promise<BannedItem>;
let saveAutoBannedItem: (db: IDBDatabase, item: BannedItem, abortSignal?: AbortSignal) => Promise<void>;

if (browser) {
 const abort = "abort";
 const error = "error";
 const success = "success";
 const readonly = "readonly";
 const readwrite = "readwrite";
 const bannedItemObjectStoreName = "banned-item";

 const { promise, resolve, reject } = Promise.withResolvers();

 const openRequest = self.indexedDB.open("history", 1);
 openRequest.addEventListener("blocked", reject);
 openRequest.addEventListener(error, reject);
 openRequest.addEventListener("upgradeneeded", (ev: IDBVersionChangeEvent) => {
  const db = (ev.target as any).result as IDBDatabase;
  db.createObjectStore(bannedItemObjectStoreName, { keyPath: "id" });
 });

 openRequest.addEventListener(success, (ev) => resolve((ev.target as any).result as IDBDatabase));

 privateDbPromise = promise as Promise<IDBDatabase>;
 getAutoBannedItem = (db: IDBDatabase, abortSignal?: AbortSignal) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  abortSignal?.addEventListener(abort, reject);
  const transaction = db.transaction(bannedItemObjectStoreName, readonly);
  transaction.addEventListener(abort, reject);
  transaction.addEventListener(error, reject);
  const store = transaction.objectStore(bannedItemObjectStoreName);

  const request = store.get(-1);
  request.addEventListener(error, reject);
  request.addEventListener(success, function (this: IDBRequest<BannedItem>) {
   resolve(this.result);
  });
  return promise as Promise<BannedItem>;
 };

 saveAutoBannedItem = (db: IDBDatabase, item: BannedItem, abortSignal?: AbortSignal) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  abortSignal?.addEventListener(abort, reject);
  return promise as Promise<void>;
 }
}
else {
 privateDbPromise = null!;
 getAutoBannedItem = null!;
 saveAutoBannedItem = null!;
}

export const dbPromise = privateDbPromise;
export const getAutoBannedItemAsync = getAutoBannedItem;
export const saveAutoBannedItemAsync = saveAutoBannedItem;