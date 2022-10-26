<script setup lang="ts">
function clearRepo() {
  const confirmed = confirm('确定清空数据库吗？此操作不可逆！');
  if (confirmed) {
    window.indexedDB.open('AccountManager').onsuccess = function(openE: any): any {
      const db = openE.target.result;
      const objectStore = db.transaction('accounts', 'readwrite').objectStore('accounts');
      objectStore.openCursor().onsuccess = (cursorE: any) => {
        let cursor = cursorE.target.result;
        if (cursor) {
          objectStore.delete(cursor.key).onsuccess = function() {
            cursor.continue();
          }
        } else {
          alert('数据库已清空！')
        }
      }
    }
  }
}
</script>

<template>
  <div>
    <h1 style="color: #006699; font-size: 2.5rem">账户管理器</h1>
    <button @click="$emit('changeRoute', '/add')">新建账户</button>
    <button @click="$emit('changeRoute', '/search')">检索账户</button>
    <button @click="$emit('changeRoute', '/modify')">修改账户</button>
    <button @click="$emit('changeRoute', '/view')">查看所有账户</button>
    <button @click="$emit('changeRoute', '/import')">批量导入账户</button>
    <button @click="clearRepo()" style="background-color:#dddddd; font-weight: 400">清空数据库</button>
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