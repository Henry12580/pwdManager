<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AES, enc } from 'crypto-js';
const encrypt_key = 'wodieshihuangxin';

const allAccounts = ref<any[]>([]);
let baseData: any[] = [];
onMounted(() => {
  window.indexedDB.open('AccountManager').onsuccess = function(openEvent: any) {
    const db = openEvent.target.result;
    db.transaction('accounts').objectStore('accounts').getAll().onsuccess = function(getEvent: any) {
      baseData = getEvent.target.result;
      allAccounts.value = baseData.map((rawdata: any) => {
        let data = {...rawdata};
        data.password = AES.decrypt(data.password, encrypt_key).toString(enc.Utf8);
        return data;
      });
    }
  }
})

async function exportRepo() {
  await navigator.clipboard.writeText(AES.encrypt(JSON.stringify(baseData), 'huangxinshiwodie').toString());
  alert('已加密导出至剪贴板！');
}

// const s = 'U2FsdGVkX19+g1HNB41ktXc3744a3ZLiuEqhetzGmhva+DH9kpXArirMjodBjEfZW2bvPTe9J04UKlrVuSnJSHTLr2cvVkLnyI2bPw+mqEp7LarrhLn6UselJxrIRKHM8Yzkq8Rl0y1WDF6q+ad9JA2qFseal37ube3Xm9JVdezErq+Gz9BRmu7KVWba79DiS2obspPl0oXBKV2kBzsZqA2oLYNCBXG6uSfG/aU5omggJwbE38b8RbEZT22h+dEs43T1Njc38jYWvU5r85NohMCf7wrCXKyLn3VjB2taY1PwCgEfMRIbIgdZgQrfx9Nit3NSQWUrQyIE5MT5p3srLrH3Cmx6CuW82u48QI76lARytEHLVaPGXx/R67Apein5iFsDueNUUW9TCJdgVgrd6kkmtelUnc9nYQXZfo56f21wVV1Py+EcQmPMlGLSN9rpOQzyua+YVcghcoB7ZL9GyoFaGqiNYEceVYlpdBzV45G6kipWM9oHNBnGANzBFIic1Zn3xMfz0hkJR9TKsacNEQQAyzZJ4C0MlFAPoQUpKnsY9CCdtrJFQ1zhALR03QPIxf+17bpIB9jVFlXn7cGjcFl3sASpEBsFBZMcRPCxVpgVyHFT/ycGldKKHFcmRG16XPoQnm638u5pRAsUg2aX6d+nQ2ewpZUGBZccbXflDvA0SV8wDanv4FM6zH80X0NhJleJbmMPmISNPGoA8EfMNK3sMIk0gfw+atWIj/1xJGVXl1hQStnA/czuFQgBaXPHMtwrCMYNVHplecEd/ePQhs6QvVSiXqPs8a6sb9Qxo1LACXeATaqKqtrV+nmQemFUOFpsc8nhmIZWA5tpsnPvqmbUxUMVrHYOwMdXT0vtEb8oRYe8CB3MR+BLvAJf/kJMjB3bMCSERQpLdCkTBjWlZXyGQwhZMwcjiZQaaWiWYsN7648UBHNCynSJmj/If8jnBMci8cQQNmvBbkk8havZac/ylafMBPkXJHUIzvMLjMTfn8ZNpxfHzdf4em5xueQ1QptkcAIccMnQAsvS73gJIqkRfjXSn4I7in6pa1ataGmhla9jIu1XsxE4QfE/qnif+2ZWVjlgipy3iOE+evhkSBJGQrqFJI6SdPeM5C4K2wGrXeAmnh8hQQUM3Ry/xKxIdPFJFUeELspbEH12cVywaOrtZinhhjMLBz9zY5+BjDXNv2RPRo++DNUvZqHKZYM+lrVAIe2Zx7HBwfgdX/hJD824hQ3d+UnFtb5BpKdICHPY2/p7ALT/kIhI8e5Lf+eQ'
// console.log(AES.encrypt(JSON.stringify(JSON.parse(AES.decrypt(s, 'huangxinshiwodie').toString(enc.Utf8)).map((data: any) =>{
//   data.password = AES.encrypt(data.password, 'wodieshihuangxin').toString();
//   return data;
// })), 'huangxinshiwodie').toString());
</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2rem">查看所有账户</h1>
    <div table>
      <table rules="all" frame="border" cellpadding="5" >
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
            <td>{{data.account}}</td>
            <td>{{data.name}}</td>
            <td>{{data.password}}</td>
            <td>{{data.extraInfo}}</td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <button type="button" @click="exportRepo">导出至剪贴板</button>
    <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
  </div>
</template>