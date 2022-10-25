<script setup lang="ts">
import { ref } from 'vue';

const dbName = 'AccountManager';
const tableName = 'accounts';
let searchResult = ref<any>();

const allAccounts: any = {};
allAccounts.account = ref<string[]>([]);

function clearInput() {
  document.querySelectorAll('input').forEach((input: any) => {
    input.value = '';
  })
}

function onSubmit(event: any) {
  event.preventDefault();
  if (searchResult.value) {
    window.indexedDB.open(dbName).onsuccess = function(ev: any) {
      let db = ev.target.result;
      const objectStore = db.transaction([tableName], 'readwrite').objectStore(tableName);
      const getReq = objectStore.index('account').get(searchResult.value.account);
      getReq.onsuccess = function(e: any) {
        console.log(e.target.result);
        let data = {...e.target.result, ...searchResult.value};
        // objectStore.index('account').delete(searchResult.value.account);
        const updateReq = objectStore.put(data);
        updateReq.onsuccess = function() {
          alert('修改成功！');
        };
        updateReq.onerror = function(e: any) {
          alert('数据库修改出错！');
        }
      };
      getReq.onerror = function() {
        alert('数据库访问出错！')
      }
    }
  }
}

function viewAllAccountsBy(keyName: string) {
  if (!allAccounts[keyName].value.length) {
    window.indexedDB.open(dbName).onsuccess = function(e: any) {
      let db = e.target.result;
      const index = db.transaction(tableName).objectStore(tableName).index(keyName);
      index.openKeyCursor().onsuccess = function(e: any) {
        let cursor = e.target.result;
        if (cursor) {
          allAccounts[keyName].value.push(cursor.key);
          cursor.continue();
        }
      }
    }
  }
}

function searchAccount(ev: any) {
  ev.preventDefault();
  const { value } = ev.target;
  window.indexedDB.open(dbName).onsuccess = function(e: any) {
    let db = e.target.result;
    const request = db.transaction(tableName).objectStore(tableName).index('account').get(value);
    request.onsuccess = function(event: any) {
      searchResult.value = event.target.result;
    }
  }
}

</script>
<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">修改账户</h1>
    <form @submit="onSubmit">
      <div input>
        请输入或选择账户名称：
        <input id="input-account" type='text' name='账户名称' list="allaccounts" @focus="viewAllAccountsBy('account')" @input="searchAccount" />
        <datalist id="allaccounts">
          <option v-for="account of allAccounts.account.value">{{ account }}</option>
        </datalist>
        <div v-if="searchResult">
          用户名：
          <input type='text' name='用户名' v-model="searchResult.name" />
          密码：
          <input type='text' name='密码' v-model="searchResult.password" />
          附加信息：
          <input type="text" name="附加信息" v-model="searchResult.extraInfo"/>
        </div>
      </div>
      <button type='submit'>确认修改</button>
      <button type="button" @click="clearInput">清除输入</button>
    </form>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>