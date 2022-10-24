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

  let db;
  const dbName = 'AccountManager';
  const request = indexedDB.open(dbName);
  request.onerror = () => alert('数据库打开失败！请检查是否禁用了indexedDB数据库！');
  request.onsuccess = () => db = request.result;
  request.onupgradeneeded = (e: any) => {
    db = e.target.result;
  }
  return false;
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

function onFocus(e: Event): void {
  e.preventDefault();
  const inputElem = e.target as HTMLInputElement;
  if (inputElem.style.borderColor === 'red') {
    inputElem.style.borderColor = '';
    inputElem.value = '';
  }
}

</script>

<template>
  <div>
    <form @submit="onSubmit">
      <div input>
        账户名称*：<input id="input-account" type='text' name='账户名称' required @focus="onFocus" />
        用户名*：<input id="input-name" type='text' name='用户名' required @focus="onFocus"/>
        密码*：<input id="input-password" type='text' name='密码' required @focus="onFocus"/>
        附加信息：<input id="input-extraInfo" type="text" name="附加信息" />
      </div>
      <button type='submit'>确认</button>
    </form>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>

<style scoped>
input {
  display: block;
  margin: 0.2rem auto 0.8rem;
  height: 1.5rem;
  width: 100%;
}

div[input] {
  margin: 0 auto;
  text-align: left;
  width: 90%;
  font-weight: bold;
}

button {
  display: block;
  margin: 0.5rem auto;
}

button[type='submit'] {
  background-color: #006699;
  color: white;
  font-weight: bold;
  
}

button[type='button'] {
  padding: 0.5rem;
  border-radius: 10%;
}
</style>