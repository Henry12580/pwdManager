<script setup lang="ts">
  
</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2.5rem">账户管理器</h1>
    <button @click="$emit('changeRoute', '/add')">新建账户</button>
    <button @click="$emit('changeRoute', '/search')">检索账户</button>
    <button @click="$emit('changeRoute', '/modify')">修改账户</button>
    <button @click="$emit('changeRoute', '/view')">查看所有账户</button>
    <button @click="$emit('changeRoute', '/export')">导出所有账户</button>
  </div>
</template>

<style scoped>

  [highlight] {
    font-size: 1.1rem;
  }

  button {
    display: block;
    margin: 0.5rem auto;
    background-color: bisque;
    color:black;
    font-weight:bold;
  }
</style>