<script setup lang="ts">
import { AES } from 'crypto-js';
import DBstore from '../store';
import { IDB_OPEN_ERROR, ADD_SUCCESS, ADD_FAILURE } from '../messages';

const encrypt_key = 'wodieshihuangxin';

let { db } = DBstore;
if (!db) {
  try {
    db = await DBstore.openDB();
  } catch(err) {
    alert(IDB_OPEN_ERROR);
  }
}

async function addPwd(formList: any): Promise<boolean> {
  const formData: any = {};
  formData.account = formList[0].value;
  formData.name = formList[1].value;
  formData.password = AES.encrypt(formList[2].value, encrypt_key).toString();
  formData.extraInfo = formList[3].value;

  //add data;
  const { tableName } = DBstore;
  if (db) {
    const transResult = db.transaction(tableName, 'readwrite').objectStore(tableName).add(formData);
    transResult.onsuccess = function(e: Event): any {
      alert(ADD_SUCCESS);
    };
    transResult.onerror = function(e: Event): any {
      alert(ADD_FAILURE);
    }
  }
  return true;
}

function onSubmit(e: any): void{
  e.preventDefault();
  addPwd(e.target);
}

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
        用户名：<input id="input-name" type='text' name='用户名' />
        密码：<span style="color: red; font-weight: 400; font-size: 0.8rem;">（加密存储）</span><input id="input-password" type='text' name='密码' />
        附加信息：<input id="input-extraInfo" type="text" name="附加信息" />
      </div>
      <button type='submit'>确认</button>
      <button type="button" @click="clearInput()">清除输入</button>
    </form>
    <button type="button" @click="$router.back()">返回首页</button>
  </div>
</template>