<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AES, enc } from 'crypto-js';
import DBstore from '../store';
import { IDB_OPEN_ERROR } from '../messages';

const encrypt_key = 'wodieshihuangxin';

const allAccounts = ref<any[]>([]);

const { tableName } = DBstore;

let { db } = DBstore;
if (!db) {
  try {
    db = await DBstore.openDB();
  } catch (err) {
    alert(IDB_OPEN_ERROR);
  }
}

let baseData: any[] = [];

if (db) {
  db.transaction(tableName).objectStore(tableName).getAll().onsuccess = function (getEvent: any) {
    baseData = getEvent.target.result;
    allAccounts.value = baseData.map((rawdata: any) => {
      let data = { ...rawdata };
      data.password = AES.decrypt(data.password, encrypt_key).toString(enc.Utf8);
      return data;
    });
  }
}

async function exportRepo() {
  await navigator.clipboard.writeText(AES.encrypt(JSON.stringify(baseData), 'huangxinshiwodie').toString());
  alert('已加密导出至剪贴板！');
}

</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">查看所有账户</h1>
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
    <button type="button" @click="exportRepo">导出至剪贴板</button>
    <button type="button" @click="$router.back()">返回首页</button>
  </div>
</template>