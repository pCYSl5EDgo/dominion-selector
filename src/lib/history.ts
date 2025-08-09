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
   expansions: { kindId: number, expansionId: number }[];
   ids: number[];
  };
  ids: number[];
 };
}

const abort = "abort";
const error = "error";
const success = "success";
const readonly = "readonly";
const readwrite = "readwrite";
const bannedItemObjectStoreName = "banned-item";

let privateDbPromise: Promise<IDBDatabase> | null;
if (browser) {
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
}
else {
 privateDbPromise = null;
}

export const db = privateDbPromise == null ? null : await privateDbPromise;

export const getAutoBannedItemAsync = (db: IDBDatabase, abortSignal?: AbortSignal) => {
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
 return promise as Promise<BannedItem | undefined>;
};

export const saveAutoBannedItemAsync = (db: IDBDatabase, item: BannedItem, abortSignal?: AbortSignal) => {
 const { promise, resolve, reject } = Promise.withResolvers();
 abortSignal?.addEventListener(abort, reject);
 const transaction = db.transaction(bannedItemObjectStoreName, readwrite);
 transaction.addEventListener(abort, reject);
 transaction.addEventListener(error, reject);
 transaction.addEventListener("complete", resolve);
 transaction.objectStore(bannedItemObjectStoreName).put(item, -1).addEventListener(error, reject);
 return promise as Promise<void>;
}