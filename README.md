# 账户管理器

Web端纯本地账户信息管理工具，利用indexedDB实现各个平台账号相关信息的存储管理，并通过PWA实现Web应用安装与离线访问。

![账户管理器](/pictures/pwdManager.png)

## 技术实现

### Vue3 + Typescript + indexedDB + PWA(service worker) + crypto-js

## 功能描述

### 新建账户

密码经过aes对称加密存储。

![新建账户](/pictures/addPwd.png)

### 检索账户

![检索账户](/pictures/searchPwd.png)

### 修改账户

![修改账户](/pictures/modifyPwd.png)

### 查看所有账户

提供批量导出至剪贴板功能，为防止其他app读取剪贴板，导出到剪贴板的数据再经过一层aes加密。

![查看所有](/pictures/viewRepo.png)

### 批量导入

加密导出至剪贴板的数据，解密后导入数据库。

![批量导入](/pictures/importRepo.png)

### 清空数据库

点击清空时会跳出alert，再次确认后清空indexedDB数据库。
