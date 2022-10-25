<script setup lang="ts">
import { ref, onMounted } from 'vue';

const allAccounts = ref<any[]>([]);
onMounted(() => {
  window.indexedDB.open('AccountManager').onsuccess = function(openEvent: any) {
    const db = openEvent.target.result;
    db.transaction('accounts').objectStore('accounts').getAll().onsuccess = function(getEvent: any) {
      allAccounts.value = getEvent.target.result;
    }
  }
})

async function exportRepo() {
  await navigator.clipboard.writeText(JSON.stringify(allAccounts.value));
  alert('已复制到剪贴板！');
}

</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">查看所有账户</h1>
    <div>
      <table rules="rows" frame="below">
        <summary style="background-color: bisque;">查询结果</summary>
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
    <button type="button" @click="exportRepo">导出至剪贴板</button>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>