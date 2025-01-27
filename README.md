# Tasks Todo

This is a todo app using web sockets to share lists. 

## 💫 Deploy

## 🚀 Quick start

```shell
cd server
npm install 
tsc
cd ../client
npm i
cd ../
npm run start
```

### 📦 Env Variable Definitions

copy server/.env.sample to server/.env 

```shell
DOTENV_LOADED="true"
CLIENT_URL="http://localhost:3004"
TODO_LIST_ID="list1"
TODO_LIST_NAME="Shared List"
API_PORT="3005"
```

copy client/.env.sample to client/.env 

```shell
VITE_SERVER_URL="http://localhost:3005"
VITE_SOCKET_AUTO_CONNECT="false"
VITE_PORT="3004"
VITE_ALLOWED_HOSTS="tasks.ccollins.io,localhost"
```




## 🏆 Credit

- [Christopher Collins](https://ccollins.io)