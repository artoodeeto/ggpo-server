# GGPO (GOOD GAME PEACE OUT!)

For Gamers By Gamers

This will the backend. API services

## Installation

### Prerequisites
  - [NVM](https://github.com/nvm-sh/nvm) (optional if you're not using docker) I'm using this for node versions.
    - on the root folder run `nvm use`
  - [Docker](https://www.docker.com/get-started) (optional) if you want to run this with docker. I'm using this with docker-compose.
  - [MySql](https://www.mysql.com/) please refer to specific OS installation and user version **mysql:8.0.18**. Also dont forget to create a user 
    - `RUN "ALTER USER 'your user name' IDENTIFIED WITH mysql_native_password BY 'your password';"` 
    - `RUN "FLUSH PRIVILEGES;"`

##### Without Docker

1. Fork this repo and clone it on your system.
2. Create a `.env` file on the root folder, then add this on your `.env` file
   1. `NODE_ENV=development`
   2. `API_VERSION=V1`
   3. `PREFIX=api`
   4. `SALT_ROUND=11`
   5. `MYSQL_PASSWORD=your password`
   6. `MYSQL_ROOT_PASSWORD=same as mysql_password`
   7. `MYSQL_DATABASE=development_db`
3. On the `ormconfig.ts` file uncomment both `host:"localhost"` and `port:3306`
4. run `npm install`
5. run the app using `npm run dev`

**NOTE:** If you're using DBMS, use your mysql credentials

--- 

##### With Docker

1. Fork this repo and clone it on your system.
2. Inside the root folder run command `docker-compose up`. My advice don't run it on detached mode so you can see the query logs

**NOTE:** If you're using DBMS use the host `host:0.0.0.0` then your credentials.
