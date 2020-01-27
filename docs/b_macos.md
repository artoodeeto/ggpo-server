---
id: b_macos
title: MacOS 🍎
sidebar_label: MacOS 🍎
---

## Installing GGPO on MacOS


### Backend

**NODE**

  1. I'm using [nvm](https://github.com/nvm-sh/nvm) for managing different versions of node. Follow their [installation guide](https://github.com/nvm-sh/nvm#install--update-script)

  2. After forking and installing nvm. You can set node version by:
     1. Going inside the root folder/project,
     2. then run command `nvm use` it will read `.nvmrc` file in the root folder and set the folder to a specific node version

  *If you don't want to use NVM*

  1. To have a smoothly running development make sure you install the same node version. You can always refer to `.nvmrc` file inside the root folder.


**MYSQL**

  1. [MySql](https://www.mysql.com/) please refer to specific OS installation and install version **mysql:8.0.18**. Also don't forget to create a user.
    - `RUN "ALTER USER 'your user name' IDENTIFIED WITH mysql_native_password BY 'your password';"` 
    - `RUN "FLUSH PRIVILEGES;"`

**Docker**

  1. Refer to docker [installation guide](https://hub.docker.com/editions/community/docker-ce-desktop-mac). (this is optional if you don't want to use docker)

---

**Using docker to run the application**

  Assuming that you've installed docker successfully and have the environment variables ready. You can now run the app thru docker by:

  1. `docker-compose up`. I'm not running docker on detached mode so I can see the query logs. It helps me debug or check the query if its correct.

     - To kill the app run command `docker-compose down`


**Without using docker to run the application**

  1. On the `ormconfig.ts` file uncomment both `host:"localhost"` and `port:3306`, then comment `host: 'db'`
  2. run command `npm install`
  3. run the app using `npm run dev`

**NOTE:** If you're using DBMS, use your mysql credentials