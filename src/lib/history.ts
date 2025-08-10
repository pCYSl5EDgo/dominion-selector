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
const complete = "complete";
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

const autoSaveIdName = "auto-save-banned-item-id";
export const getAutoSaveId = () => browser ? Number.parseInt(self.localStorage.getItem(autoSaveIdName) ?? "") : Number.NaN;
export const saveAutoSaveId = (id: number) => {
 if (browser) {
  self.localStorage.setItem(autoSaveIdName, id.toString());
 }
}


export const getBannedItemAsync = (db: IDBDatabase, id: number, abortSignal?: AbortSignal) => {
 const { promise, resolve, reject } = Promise.withResolvers();
 abortSignal?.addEventListener(abort, reject);
 const transaction = db.transaction(bannedItemObjectStoreName, readonly);
 transaction.addEventListener(abort, reject);
 transaction.addEventListener(error, reject);
 const store = transaction.objectStore(bannedItemObjectStoreName);

 const request = store.get(id);
 request.addEventListener(error, reject);
 request.addEventListener(success, function (this: IDBRequest<BannedItem>) {
  resolve(this.result);
 });
 return promise as Promise<BannedItem | undefined>;
};

export const saveBannedItemAsync = (db: IDBDatabase, item: BannedItem, abortSignal?: AbortSignal) => {
 const { promise, resolve, reject } = Promise.withResolvers();
 abortSignal?.addEventListener(abort, reject);
 const transaction = db.transaction(bannedItemObjectStoreName, readwrite);
 transaction.addEventListener(abort, reject);
 transaction.addEventListener(error, reject);
 transaction.addEventListener(complete, resolve);
 transaction.objectStore(bannedItemObjectStoreName).put(item).addEventListener(error, reject);
 return promise as Promise<void>;
}

export const listBannedItemIdNamePairAsync = (db: IDBDatabase, abortSignal?: AbortSignal) => {
 const { promise, resolve, reject } = Promise.withResolvers();
 abortSignal?.addEventListener(abort, reject);
 const transaction = db.transaction(bannedItemObjectStoreName, readonly);
 transaction.addEventListener(abort, reject);
 transaction.addEventListener(error, reject);
 const list: { id: number, name: string }[] = [];
 transaction.addEventListener(complete, () => resolve(list));
 const store = transaction.objectStore(bannedItemObjectStoreName);
 const request = store.openCursor();
 request.addEventListener(error, reject);
 request.addEventListener(success, function (this: IDBRequest<IDBCursorWithValue>) {
  const cursor = this.result;
  if (cursor) {
   const value = cursor.value as BannedItem;
   list.push(value);
   cursor.continue();
  }
 });
 return promise as Promise<{ id: number, name: string }[]>;
}

export const deleteBannedItemAsync = (db: IDBDatabase, id: number, abortSignal?: AbortSignal) => {

}