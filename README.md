# GGPO (GOOD GAME PEACE OUT!)

For Gamers By Gamers

This will be the backend. API services

## Documentation

For detailed documentation:

1. cd into `website` folder
2. run `npm start`

**API DOCUMENTATION**

You can also checkout the API documentation by running the application and going to `http://localhost:8000/api/docs` route

## Installation

### Prerequisites

- Fork this repo and clone it on your system.
- [NVM](https://github.com/nvm-sh/nvm) (optional if you're not using docker) I'm using this for managing node versions.
  - on the root folder run `nvm use`
- [Docker](https://www.docker.com/get-started) (optional) if you want to run this with docker. I'm using this with docker-compose.
- [MySql](https://www.mysql.com/) please refer to specific OS installation and install version **mysql:8.0.18**. Also dont forget to create a user
  - `RUN "ALTER USER 'your user name' IDENTIFIED WITH mysql_native_password BY 'your password';"`
  - `RUN "FLUSH PRIVILEGES;"`
- On the root folder you will see a file named `the_env_file.txt` change this file name to `.env`. After changing all you need to do is change some of the values from the files
  - `MYSQL_PASSWORD=your password`
  - `MYSQL_ROOT_PASSWORD=same as mysql_password`
  - `MYSQL_DATABASE=development_db`
  - `TYPEORM_USERNAME= your mysql username`
  - `TYPEORM_PASSWORD= your mysql password`

##### Without Docker

1. On the root folder change the file name `the_env_file.txt` to `.env` file uncomment `host:"localhost"` then comment `host: 'db'`. This error is explained in the docs.
2. run `npm install`.
3. Run the app using `npm run dev`.
4. Then run the migration `npm run migration:run`

**_Note:_** Make sure you have mysql running. In macOS using brew `brew services start mysql`. For now I don't know how to run it mysql on other OS. You don't have to run it on the background process though, as long as your mysql is running. Also if you're using DBMS, use your mysql credentials

---

##### With Docker

1. Inside the root folder run command `docker-compose up`. To kill docker run `docker-compose down`. My advice don't run it on detached mode so you can see the query logs
2. Then comment `TYPEORM_HOST=db` and uncomment `TYPEORM_HOST=localhost`.
3. Run `npm run migration:run`
4. And uncomment `TYPEORM_HOST=db` and comment `TYPEORM_HOST=localhost`.

**_Note:_** If you're using DBMS use the host `host:0.0.0.0` then your credentials.

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
