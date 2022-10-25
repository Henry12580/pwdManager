<script setup lang="ts">
import { ref, onMounted } from 'vue';

const allAccounts = ref<any[]>([]);
let state = 0;

function showAllAccounts() {
  const req = window.indexedDB.open('AccountManager');
  req.onsuccess = function(openEvent: any) {
    const db = openEvent.target.result;
    db.transaction('accounts').objectStore('accounts').getAll().onsuccess = function(getEvent: any) {
      allAccounts.value = getEvent.target.result;
    }
  }
};

function addPwd(importData: any): boolean {
  const { indexedDB } = window;
  const dbName = 'AccountManager';
  const tableName = 'accounts';
  const request = indexedDB.open(dbName);
  request.onerror = function(e: Event): void {
    alert('数据库打开失败！请检查是否禁用了indexedDB数据库！');
  };

  if (!indexedDB) {
    alert('当前浏览器不支持本地数据库！');
    return false;
  }

  let db: any;

  function addData(data: any): void {
    let objectStore = db.transaction(tableName, 'readwrite').objectStore(tableName);
    const addReq = objectStore.add(data);
    addReq.onsuccess = () => {
      state++;
    }
    addReq.onerror = function(): any {
      const cover = confirm(`账户名称【${data.account}】已存在！是否选择覆盖？`);
      if (cover) {
        objectStore = db.transaction(tableName, 'readwrite').objectStore(tableName);
        const getkeyReq = objectStore.index('account').getKey(data.account);
        getkeyReq.onsuccess = function(getKeyEvent: any) {
          const key = getKeyEvent.target.result;
          objectStore.delete(key).onsuccess = function() {
            objectStore.put(data);
            state++;
          };
        };
        getkeyReq.onerror = (e: any) => {
          alert('未知错误！');
        }
      }
    }
  }

  request.onsuccess = function(): void {
    db = this.result;
    importData.forEach(addData);
  };

  request.onupgradeneeded = (e: any) => {
    db = e.target.result;
    const objectStore = db.createObjectStore(tableName, {autoIncrement: true});
    objectStore.createIndex('account', 'account', {unique: true});
    objectStore.createIndex('name', 'name', {unique: false});
    objectStore.createIndex('password', 'password', {unique: false});
  }

  return true;
}

async function importRepo() {
  const text = await navigator.clipboard.readText();
  const importData = JSON.parse(text);
  addPwd(importData);
  showAllAccounts();
}

</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">批量导入账户</h1>
    <div>
      <table rules="rows" frame="below">
        <summary style="background-color: bisque;">导入结果</summary>
        <tr>
          <th>账户名称</th>
          <th>用户名</th>
          <th>密码</th>
          <th>附加信息</th>
        </tr>
        <tr v-for="data in allAccounts">
          <td>{{data.account}}</td>
          <td>{{data.name}}</td>
          <td>{{data.password}}</td>
          <td>{{data.extraInfo}}</td>
        </tr>
      </table>
      <br />
    </div>
    <button type="button" @click="importRepo">剪贴板导入</button>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>