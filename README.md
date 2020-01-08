# GGPO (GOOD GAME PEACE OUT!)

For Gamers By Gamers

This will be the backend. API services

## Installation

### Prerequisites
  - Fork this repo and clone it on your system.
  - [NVM](https://github.com/nvm-sh/nvm) (optional if you're not using docker) I'm using this for node versions.
    - on the root folder run `nvm use`
  - [Docker](https://www.docker.com/get-started) (optional) if you want to run this with docker. I'm using this with docker-compose.
  - [MySql](https://www.mysql.com/) please refer to specific OS installation and install version **mysql:8.0.18**. Also dont forget to create a user 
    - `RUN "ALTER USER 'your user name' IDENTIFIED WITH mysql_native_password BY 'your password';"` 
    - `RUN "FLUSH PRIVILEGES;"`
  - Create a `.env` file on the root folder, then add these in your `.env` file
     - `NODE_ENV=development`
     - `API_VERSION=V1`
     - `PREFIX=api`
     - `SALT_ROUND=11`
     - `MYSQL_PASSWORD=your password`
     - `MYSQL_ROOT_PASSWORD=same as mysql_password`
     - `MYSQL_DATABASE=development_db`

##### Without Docker

1. On the `ormconfig.ts` file uncomment both `host:"localhost"` and `port:3306`, then comment `host: 'db'`
2. run `npm install`
3. run the app using `npm run dev`

**NOTE:** If you're using DBMS, use your mysql credentials

--- 

##### With Docker

1. Inside the root folder run command `docker-compose up`. My advice don't run it on detached mode so you can see the query logs

**NOTE:** If you're using DBMS use the host `host:0.0.0.0` then your credentials.
