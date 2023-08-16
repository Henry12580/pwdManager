<script setup lang="ts">
import { ref } from 'vue';
import { AES, enc } from 'crypto-js';
import DBstore from '../store';
import { IDB_OPEN_ERROR, MATCH_ERROR } from '../messages';

const encrypt_key = 'wodieshihuangxin';

const { tableName } = DBstore;

let { db } = DBstore;
if (!db) {
  try {
    db = await DBstore.openDB();
  } catch (err) {
    alert(IDB_OPEN_ERROR);
  }
}

const searchResult = ref<any[]>([]);

const allAccounts: any = {};
allAccounts.account = ref<string[]>([]);
allAccounts.name = ref<string[]>([]);
allAccounts.password = ref<string[]>([]);

function clearInput() {
  document.querySelectorAll('input').forEach((input: any) => {
    input.value = '';
  })
}

function onSubmit(event: any) {
  event.preventDefault();
  const form = event.target;
  if (db && (form[0].value || form[1].value || form[2].value)) {
    db.transaction(tableName).objectStore(tableName).openCursor().onsuccess = function (e: any) {
      let cursor = e.target.result;
      if (cursor) {
        const value = { ...cursor.value };
        value.password = AES.decrypt(value.password, encrypt_key).toString(enc.Utf8);
        if ((!form[0].value || value.account === form[0].value)
          && (!form[1].value || value.name === form[1].value)
          && (!form[2].value || value.password === form[2].value)
        ) {
          searchResult.value.push(value);
        }
        cursor.continue();
      }
      else if (!searchResult.value.length) {
        console.log(searchResult.value);
        alert(MATCH_ERROR)
      }
    }
  }
}

function viewAllAccountsBy(keyName: string) {
  if (db && !allAccounts[keyName].value.length) {
    const index = db.transaction(tableName).objectStore(tableName).index(keyName);
    index.openKeyCursor().onsuccess = function (e: any) {
      let cursor = e.target.result;
      const { value } = allAccounts[keyName];
      if (cursor) {
        const keyValue: string = keyName === 'password' ? AES.decrypt(cursor.key, encrypt_key).toString(enc.Utf8) : cursor.key;
        if (keyName === 'account' || value.indexOf(keyValue) === -1) {
          value.push(keyValue);
        }
        cursor.continue();
      } else {
        value.sort((a: string, b: string) => a < b ? -1 : 1);
      }
    }
  }
}

function clearResult() {
  searchResult.value = [];
}

</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">检索账户</h1>
    <form @submit="onSubmit" v-if="!searchResult.length">
      <div input>
        根据账户名称检索：<input id="input-account" type='text' name='账户名称' list="allaccounts"
          @focus="viewAllAccountsBy('account')" />
        <datalist id="allaccounts">
          <option v-for="account of allAccounts.account.value">{{ account }}</option>
        </datalist>
        根据用户名检索：<input id="input-name" type='text' name='用户名' list="allnames" @focus="viewAllAccountsBy('name')" />
        <datalist id="allnames">
          <option v-for="name of allAccounts.name.value">{{ name }}</option>
        </datalist>
        根据密码检索：<input id="input-password" type='text' name='密码' list="allpasswords"
          @focus="viewAllAccountsBy('password')" />
        <datalist id="allpasswords">
          <option v-for="password of allAccounts.password.value">{{ password }}</option>
        </datalist>
      </div>
      <button type='submit'>查询</button>
      <button type="button" @click="clearInput">清除输入</button>
    </form>
    <div v-if="searchResult.length">
      <span searchResult>查询结果</span>
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
            <tr v-for="data in searchResult" tableContent>
              <td>{{ data.account }}</td>
              <td>{{ data.name }}</td>
              <td>{{ data.password }}</td>
              <td>{{ data.extraInfo }}</td>
            </tr>
          </tbody>
        </table>
        <br />
      </div>
    </div>
    <button type="button" @click="clearResult()">返回查询页</button>
    <button type="button" @click="$router.back()">返回首页</button>
  </div>
</template>