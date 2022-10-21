<script setup lang="ts">
let account = '';
let name = '';
let password = '';
let extraInfo = '';

function onSubmit(e: any) {
  e.preventDefault();
  console.log(e);
}

</script>

<template>
  <form>
    <div input>
      账户名称：<input type='text' name='account' required oninvalid="setCustomValidity('账户名称不能为空！')" oninput="setCustomValidity('')" />
      用户名：<input type='text' name='name' required oninvalid="setCustomValidity('用户名不能为空！')" oninput="setCustomValidity('')"/>
      密码：<input type='password' name='password' required oninvalid="setCustomValidity('密码不能为空！')" oninput="setCustomValidity('')"/>
      附加信息：<input type="text" name="extraInfo" />
    </div>
    <button type='submit' @click="onSubmit">确认</button>
  </form>
  <button type="button" @click="$emit('changeRoute', '/')">返回主页</button>
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