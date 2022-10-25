<script setup lang="ts">
import { ref } from 'vue';

function addPwd(formList: any): boolean {
  const formData: any = {};
  formData.account = formList[0].value;
  formData.name = formList[1].value;
  formData.password = formList[2].value;
  formData.extraInfo = formList[3].value;
  
  const { indexedDB } = window;

  if (!indexedDB) {
    alert('当前浏览器不支持本地数据库！');
    return false;
  }

  let db: any;

  //add data;
  function addData(): void {
    const transResult = db.transaction(tableName, 'readwrite').objectStore(tableName).add(formData);
    transResult.onsuccess = function(e: Event): any {
      alert('添加成功！');
    };
    transResult.onerror = function(e: Event): any {
      alert('添加失败！账户名称已存在！');
    }
  }

  //(create and)open database;
  const dbName = 'AccountManager';
  const tableName = 'accounts';
  const request = indexedDB.open(dbName);
  request.onerror = function(e: Event): void {
    alert('数据库打开失败！请检查是否禁用了indexedDB数据库！');
  };
  request.onsuccess = function(e: Event): void {
    db = this.result;
    addData();
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

function onSubmit(e: any): void{
  e.preventDefault();
  // const formData = ['account', 'name', 'password', 'extraInfo'];
  // let formValid = true;
  // for (const data of formData) {
  //   const dataNode = document.querySelector(`#input-${data}`) as HTMLInputElement;
  //   if (!dataNode.value && dataNode.required) {
  //     dataNode.style.borderColor = 'red';
  //     dataNode.value = dataNode.name + '是必填项！';
  //     formValid = false;
  //   }
  // };
  // if (formValid) {
    addPwd(e.target);
  // }
}

// function onFocus(e: Event): void {
//   e.preventDefault();
//   const inputElem = e.target as HTMLInputElement;
//   if (inputElem.style.borderColor === 'red') {
//     inputElem.style.borderColor = '';
//     inputElem.value = '';
//   }
// }

function clearInput() {
  document.querySelectorAll('input').forEach((input: any) => {
    input.value = '';
  })
}

</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">新建账户</h1>
    <form @submit="onSubmit">
      <div input>
        账户名称*：<input id="input-account" type='text' name='账户名称' required />
        用户名*：<input id="input-name" type='text' name='用户名' required />
        密码*：<input id="input-password" type='text' name='密码' required />
        附加信息：<input id="input-extraInfo" type="text" name="附加信息" />
      </div>
      <button type='submit'>确认</button>
      <button type="button" @click="clearInput()">清除输入</button>
    </form>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>