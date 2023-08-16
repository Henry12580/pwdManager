<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AES, enc } from 'crypto-js';
import DBstore from '../store';
import { IDB_OPEN_ERROR, UNKNOWN_ERROR } from '../messages';

const encrypt_key = 'wodieshihuangxin';
const allAccounts = ref<any[]>([]);

let { db } = DBstore;
if (!db) {
  try {
    db = await DBstore.openDB();
  } catch (err) {
    alert(IDB_OPEN_ERROR);
  }
}

const { tableName } = DBstore;

function showAllAccounts() {
  if (db) {
    db.transaction('accounts').objectStore('accounts').getAll().onsuccess = function (getEvent: any) {
      allAccounts.value = getEvent.target.result;
      allAccounts.value.forEach((data: any) => {
        data.password = AES.decrypt(data.password, encrypt_key).toString(enc.Utf8);
        return data;
      });
    }
  }
};

function addData(data: any): void {
  if (db) {
    let objectStore = db.transaction(tableName, 'readwrite').objectStore(tableName);
    const addReq = objectStore.add(data);
    addReq.onerror = function () {
      const cover = confirm(`账户名称【${data.account}】已存在！是否覆盖？`);
      if (cover && db) {
        objectStore = db.transaction(tableName, 'readwrite').objectStore(tableName);
        const getkeyReq = objectStore.index('account').getKey(data.account);
        getkeyReq.onsuccess = function (getKeyEvent: any) {
          const key = getKeyEvent.target.result;
          objectStore.delete(key).onsuccess = function () {
            objectStore.put(data);
          };
        };
        getkeyReq.onerror = (e: any) => {
          alert(UNKNOWN_ERROR);
        }
      }
    }
  }
}

async function importRepo() {
  const encryptedText = await navigator.clipboard.readText();
  const importData: any[] = JSON.parse(AES.decrypt(encryptedText, 'huangxinshiwodie').toString(enc.Utf8));
  importData.forEach( (data: any, idx: number) => {
    addData(data);
    if (idx === importData.length - 1) {
      showAllAccounts();
    }
  });
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
            <td>{{ data.account }}</td>
            <td>{{ data.name }}</td>
            <td>{{ data.password }}</td>
            <td>{{ data.extraInfo }}</td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <button type="button" @click="importRepo">剪贴板导入</button>
    <button type="button" @click="$router.back()">返回首页</button>
  </div>
</template>