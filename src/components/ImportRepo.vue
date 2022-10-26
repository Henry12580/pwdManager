<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AES, enc } from 'crypto-js';
const encrypt_key = 'wodieshihuangxin';

const allAccounts = ref<any[]>([]);
// let baseData: any[] = [];

function showAllAccounts() {
  const req = window.indexedDB.open('AccountManager');
  req.onsuccess = function(openEvent: any) {
    const db = openEvent.target.result;
    db.transaction('accounts').objectStore('accounts').getAll().onsuccess = function(getEvent: any) {
      allAccounts.value = getEvent.target.result;
      allAccounts.value.forEach((data: any) => {
        data.password = AES.decrypt(data.password, encrypt_key).toString(enc.Utf8);
        return data;
      })
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
    addReq.onerror = function(): any {
      const cover = confirm(`账户名称【${data.account}】已存在！是否覆盖？`);
      if (cover) {
        objectStore = db.transaction(tableName, 'readwrite').objectStore(tableName);
        const getkeyReq = objectStore.index('account').getKey(data.account);
        getkeyReq.onsuccess = function(getKeyEvent: any) {
          const key = getKeyEvent.target.result;
          objectStore.delete(key).onsuccess = function() {
            objectStore.put(data);
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
  const encryptedText = await navigator.clipboard.readText();
  const importData = JSON.parse(AES.decrypt(encryptedText, 'huangxinshiwodie').toString(enc.Utf8));
  addPwd(importData);
  setInterval(showAllAccounts,500);
}

</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">批量导入账户</h1>
    <span searchResult>导入结果</span>
    <div table>
      <table rules="all" frame="border" cellpadding="5">
        <thead>
          <tr>
            <th>账户名称</th>
            <th>用户名</th>
            <th>密码</th>
            <th>附加信息</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in allAccounts">
            <td>{{data.account}}</td>
            <td>{{data.name}}</td>
            <td>{{data.password}}</td>
            <td>{{data.extraInfo}}</td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <button type="button" @click="importRepo">剪贴板导入</button>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>