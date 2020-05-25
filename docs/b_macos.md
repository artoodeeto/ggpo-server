---
id: b_macos
title: MacOS 🍎
sidebar_label: MacOS 🍎
---

## Installing GGPO on MacOS

### Backend

**ENV**

1. After successfully creating a `.env` file. You can proceed to this instructions.

**NODE**

1. I'm using [nvm](https://github.com/nvm-sh/nvm) for managing different versions of node. Follow their [installation guide](https://github.com/nvm-sh/nvm#install--update-script)

2. After forking and installing nvm. You can set node version by:
   1. Going inside the root folder/project,
   2. then run command `nvm use` it will read `.nvmrc` file in the root folder and set the folder to a specific node version

_If you don't want to use NVM_

1. To have a smoothly running development make sure you install the same node version. You can always refer to `.nvmrc` file inside the root folder.

**MYSQL**

1. [MySql](https://www.mysql.com/) please refer to specific OS installation and install version **mysql:8.0.18**. Also don't forget to create a user.
   - `RUN "ALTER USER 'your user name' IDENTIFIED WITH mysql_native_password BY 'your password';"`
   - `RUN "FLUSH PRIVILEGES;"`

**Docker**

1. Refer to docker [installation guide](https://hub.docker.com/editions/community/docker-ce-desktop-mac). (this is optional if you don't want to use docker)

---

**Using docker to run the application**

1. Inside the root folder run command `docker-compose up`. My advice don't run it on detached mode so you can see the query logs
2. After the server is running and ready to take connections, run command `npm run migration:run`

_To kill docker run `docker-compose down`_

**Without using docker to run the application**

1.  On the `.env` file uncomment `host:"localhost"` then comment `host: 'db'`. (This error is explained on the Bugs part of the documentation).
2.  run `npm install`.
3.  Run the app using `npm run dev`.
4.  Then run the migration `npm run migration:run`

**_Note:_** Make sure you have mysql running. In macOS using brew `brew services start mysql`. For now I don't know how to run it mysql on other OS. You don't have to run it on the background process though, as long as your mysql is running. Also if you're using DBMS, use your mysql credentials

---

#### After a successful installation of the app

1. Test the api using [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/download/) or [Postwoman](https://postwoman.io/)
2. After the download goto `http://localhost:8000/api/v1/signup`
3. Then create a user.

```
{
	"username":"nocap",
	"email":"nocap@gmail.com",
	"password":"password"
}
```
