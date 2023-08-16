<script setup lang="ts">
import { ref } from 'vue';
import { AES, enc } from 'crypto-js';
import DBstore from  '../store'
import { IDB_OPEN_ERROR } from '../messages';

const encrypt_key = 'wodieshihuangxin';
let searchResult = ref<any>();

const allAccounts: any = {};
allAccounts.account = ref<string[]>([]);

const { tableName } = DBstore;

let { db } = DBstore;
if (!db) {
  try {
    db = await DBstore.openDB();
  } catch (err) {
    alert(IDB_OPEN_ERROR);
  }
}

function clearInput() {
  document.querySelectorAll('input').forEach((input: any) => {
    input.value = '';
  })
  searchResult.value = null;
}

async function onSubmit(event: any) {
  event.preventDefault();
  const { value } = searchResult;
  if (value && db) {
    const objectStore = db.transaction([tableName], 'readwrite').objectStore(tableName);
    const idx = objectStore.index('account');
    const getReq = idx.get(value.account);
    getReq.onsuccess = function(e: any) {
      let data = {...e.target.result, ...value};
      data.password = AES.encrypt(data.password, encrypt_key).toString();
      idx.getKey(value.account).onsuccess = function(getkeyE: any) {
        const key = getkeyE.target.result;
        objectStore.delete(key);
        const updateReq = objectStore.put(data);
        updateReq.onsuccess = function() {
          alert('修改成功！');
        };
        updateReq.onerror = function() {
          alert('数据库修改出错！');
        }
      }
    };
    getReq.onerror = function() {
      alert('数据库访问出错！')
    }
  }
}

function viewAllAccountsBy(keyName: string) {
  if (!allAccounts[keyName].value.length && db) {
    const index = db.transaction(tableName).objectStore(tableName).index(keyName);
    index.openKeyCursor().onsuccess = function(e: any) {
      let cursor = e.target.result;
      if (cursor) {
        allAccounts[keyName].value.push(cursor.key);
        cursor.continue();
      } else {
        allAccounts[keyName].value.sort((a: string, b: string) => a < b ? -1 : 1);
      }
    }
  }
}

function searchAccount(ev: any) {
  ev.preventDefault();
  const { value } = ev.target;
  if (db) {
    const request = db.transaction(tableName).objectStore(tableName).index('account').get(value);
    request.onsuccess = function(event: any) {
      searchResult.value = event.target.result;
      searchResult.value.password = AES.decrypt(event.target.result.password, encrypt_key).toString(enc.Utf8);
    }
  }
  
}

function deleteAccount(clickEvent: any) {
  clickEvent.preventDefault();
  const { value } = searchResult;
  if (value) {
    const confirmed: boolean = confirm('确定删除此账户吗？');
    if (confirmed && db) {
      const objectStore = db.transaction([tableName], 'readwrite').objectStore(tableName);
      const idx = objectStore.index('account');
      const getReq = idx.getKey(value.account);
      getReq.onsuccess = function(e: any) {
        const key = e.target.result;
        const deleteReq = objectStore.delete(key);
        deleteReq.onsuccess = function() {
          alert('删除成功！');
          allAccounts.account.value = allAccounts.account.value.filter((accountName: string): boolean => {
            return accountName !== value.account;
          });
          searchResult.value = null;
        };
        deleteReq.onerror = function() {
          alert('数据库出错！删除失败！');
        };
      };
      getReq.onerror = function() {
        alert('数据库访问出错！')
      }
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
    <button type="button" @click="deleteAccount" style="color: red">删除账户</button>
    <button type="button" @click="$router.back()">返回首页</button>
  </div>
</template>