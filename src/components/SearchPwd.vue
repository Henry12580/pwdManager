<script setup lang="ts">
const accountNames: string[] = [];

function clearInput() {
  document.querySelectorAll('input').forEach((input: any) => {
    input.value = '';
  })
}

function onSubmit(e: any) {
  e.preventDefault();
}

const dbName = 'AccountManager';
const tableName = 'accounts';
function viewAccountNames() {
  if (!accountNames.length) {
    window.indexedDB.open(dbName).onsuccess = function(e: any) {
      let db = e.target.result;
      const index = db.transaction(tableName).objectStore(tableName).index('name');
      index.openKeyCursor().onsuccess = function(e: any) {
        let cursor = e.target.result;
        if (cursor) {
          accountNames.push(cursor.key);
          cursor.continue();
        }
      }
    }
  }
}

</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">检索账户</h1>
    <form @submit="onSubmit">
      <div input>
        根据账户名称检索：<input id="input-account" type='text' name='账户名称' list="accountnames" @focus="viewAccountNames" />
        <datalist id="accountnames">
          <option v-for="name of accountNames">{{name}}</option>
        </datalist>
        根据用户名检索：<input id="input-name" type='text' name='用户名' />
        根据密码检索：<input id="input-password" type='text' name='密码' />
      </div>
      <button type='submit'>查询</button>
      <button type="button" @click="clearInput">清除输入</button>
    </form>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>

<style scoped>
div[input] {
  margin: 0 auto;
  text-align: left;
  width: 90%;
  font-weight: bold;
}
</style>