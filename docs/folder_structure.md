---
id: folder_structure
title: Folder 🗂
sidebar_label: Folder 🗂
---

## Backend Folder Structure

```

📦config
 ┣ 📜logger.ts // used for setting up pino logger
 ┣ 📜server.ts // this is where I setup controllers and the server itself
 ┣ 📜swagger.ts // API documentation setup
 ┗ 📜test_setup.ts // teardown and setup for database test
📦db
 ┣ 📂migrations // after running command npm run typeorm migration:create -- -n <migration name> it will be saved in migrations folder. Table names should be plural
 ┣ 📜Dockerfile // Mysql docker file
 ┗ 📜init_db.sql // used by docker to initialize db
📦src
 ┣ 📂controllers // routes to perform user request
 ┃ ┣ 📜base_controller.ts // all controllers should inherit from this class
 ┃ ┣ 📜controller_imports.ts // imports version controller just add new controllers into the childController
 ┃ ┗ 📜version_one_controller.ts
 ┣ 📂helpers
 ┣ 📂interfaces
 ┣ 📂mailers
 ┣ 📂middlewares
 ┣ 📂models
 ┃ ┣ 📜base_model.ts // all model should inherit from this base model class
 ┣ 📂subscribers // subscribers are listeners for typeorm actions; check typeorm documentation for more details
```
## Frontend Folder Structure

```
📦src
 ┣ 📂api // API routes
 ┣ 📂components
 ┣ 📂helper 
 ┃ ┣ 📂test
 ┣ 📂interfaces
 ┃ ┣ 📂api
 ┣ 📂lib
 ┃ ┣ 📜axios.instance.ts // instantiating axios
 ┃ ┗ 📜axios.interceptors.ts // request respond interceptors
 ┣ 📂models // this is where you initials reducers state
 ┣ 📂routes
 ┃ ┣ 📜main.router.tsx  // router setup
 ┃ ┗ 📜routes.config.tsx // router config
 ┣ 📂store // this is where you find the reducers, actions, selectors and their tests
 ┃ ┣ 📂root
 ┃ ┃ ┣ 📜root_reducer.ts // where combine reducer is called
 ┃ ┃ ┗ 📜root_store.ts
```
