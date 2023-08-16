import { reactive } from "vue";
import { BROWSER_WITHOUT_IDB } from "./messages";

type DBStore = {
  db: IDBDatabase | null;
  dbName: string;
  tableName: string;
  objectStore: IDBObjectStore | null;
  openObjectstore: () => Promise<any>;
  openDB: () => Promise<IDBDatabase>;
};

const DBstore = reactive({
  db: null,
  dbName: 'AccountManager',
  tableName: 'accounts',
  objectStore: null,
  openObjectstore() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.objectStore = this.db.transaction(this.tableName, 'readwrite').objectStore(this.tableName);
        resolve(this.objectStore);
      } else {
        this.openDB().then(db => {
          this.objectStore = db.transaction(this.tableName, 'readwrite').objectStore(this.tableName);
          resolve(this.objectStore);
        }).catch(err => {
          reject(err);
        })
      }
    })
  },
  openDB() {
    const { indexedDB } = window;
    if (!indexedDB) {
      alert(BROWSER_WITHOUT_IDB);
    }

    const openRequest: IDBOpenDBRequest = indexedDB.open(this.dbName);

    // 数据库升级，先触发upgradeneeded事件，再触发success事件；
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      // 建表
      if (!db.objectStoreNames.contains(this.tableName)) {
        const objectStore = db.createObjectStore(this.tableName, { autoIncrement: true });
        objectStore.createIndex('account', 'account', { unique: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('password', 'password', { unique: false });
      }
    }

    return new Promise( (resolve, reject) => {
      openRequest.onsuccess = () => {
        this.db = openRequest.result;
        resolve(this.db);
      }
  
      openRequest.onerror = () => {
        reject("openRequest error!");
      }
    })
  }
} as DBStore);

export default DBstore;