---
id: folder_structure
title: Folder 🗂
sidebar_label: Folder 🗂
---

## Backend Folder Structure

```
📦db
┣ 📂migrations // after running command npm run typeorm migration:create -- -n <migration name> it will be saved in migrations folder. Table names should be plural
┃ ┣ 📜1575433829516-UsersTable.ts
┃ ┣ 📜1581617587575-PostsTable.ts
┃ ┣ 📜1585880826189-GameGroupsTable.ts
┃ ┗ 📜1585881327751-UsersGameGroupsTable.ts
┣ 📜Dockerfile //
┗ 📜init_db.sql // initial sql run
📦helpers // helper functions that can be used in the codebase
┣ 📜contoller_error.ts
┗ 📜model_tester.ts
📦interfaces
┗ 📜error_response.ts
📦src
┣ 📂controllers // routes to perform user request
┃ ┣ 📜base_controller.ts // main controller. this will be used to create a method that can inherit child controllers. All controller should inherit from this controller, by rails convention, naming should be plural
┃ ┣ 📜controller_imports.ts // import controllers
┃ ┣ 📜game_groups_controller.ts
┃ ┣ 📜posts_controller.ts
┃ ┣ 📜sessions_controller.ts
┃ ┣ 📜users_controller.ts
┃ ┗ 📜version_one_controller.ts // parent controller
┣ 📂mailers // mailer actions, not yet implemented
┃ ┗ 📜.keep
┣ 📂middlewares // functions to perform before the actual route
┃ ┗ 📜sessions_middlewares.ts
┣ 📂models // this maps to the table that was created in the db, by rails convention names should be singular
┃ ┣ 📜base_model.ts
┃ ┣ 📜gameGroup.ts
┃ ┣ 📜post.ts
┃ ┣ 📜user.ts
┃ ┗ 📜usersGameGroup.ts
┗ 📂subscribers // read about typeorm subscribers
┃ ┗ 📜.keep
📦test
┣ 📂controllers
┃ ┣ 📜gamegroup.controller.test.ts
┃ ┣ 📜post.controller.test.ts
┃ ┣ 📜session.controlller.test.ts
┃ ┗ 📜user.controller.test.ts
┣ 📂helpers
┃ ┣ 📜controller_error.test.ts
┃ ┗ 📜model_tester.test.ts
┣ 📂middlewares
┃ ┗ 📜user.middleware.test.ts
┗ 📂models
┃ ┣ 📜gamegroup.model.test.ts
┃ ┣ 📜post.model.test.ts
┃ ┣ 📜user.model.test.ts
┃ ┗ 📜usersgamegroup.model.test.ts
```

## Frontend Folder Structure

```
📦src
 ┣ 📂api // routes to backend api
 ┃ ┗ 📜sessions.ts
 ┣ 📂assets
 ┃ ┗ 📜.keep
 ┣ 📂components // containers are also added here. If possible containers should have the state and or main logic/implementation of the feature
 ┃ ┣ 📂App
 ┃ ┃ ┣ 📜App.module.scss
 ┃ ┃ ┣ 📜App.test.tsx
 ┃ ┃ ┗ 📜App.tsx
 ┃ ┣ 📂Feed
 ┃ ┃ ┣ 📜Feed.module.scss
 ┃ ┃ ┣ 📜Feed.test.tsx
 ┃ ┃ ┗ 📜Feed.tsx
 ┃ ┣ 📂Layout
 ┃ ┃ ┗ 📜.keep
 ┃ ┣ 📂Private
 ┃ ┃ ┗ 📜Private.tsx
 ┃ ┣ 📂Profile
 ┃ ┃ ┣ 📜Profile.module.scss
 ┃ ┃ ┣ 📜Profile.test.tsx
 ┃ ┃ ┗ 📜Profile.tsx
 ┃ ┣ 📂SignupLogin // this is a container that has login and signup child component.
 ┃ ┃ ┣ 📂Login
 ┃ ┃ ┃ ┣ 📜Login.module.scss
 ┃ ┃ ┃ ┣ 📜Login.test.tsx
 ┃ ┃ ┃ ┗ 📜Login.tsx
 ┃ ┃ ┣ 📂Signup
 ┃ ┃ ┃ ┣ 📜Signup.module.scss
 ┃ ┃ ┃ ┣ 📜Signup.test.tsx
 ┃ ┃ ┃ ┗ 📜Signup.tsx
 ┃ ┃ ┣ 📜SignupLogin.module.scss
 ┃ ┃ ┣ 📜SignupLogin.test.tsx
 ┃ ┃ ┗ 📜SignupLogin.tsx
 ┃ ┗ 📂shared // shared component here
 ┃ ┃ ┗ 📜ErrorMsg.tsx
 ┣ 📂helper
 ┃ ┗ 📜sessionSetup.ts
 ┣ 📂interfaces
 ┃ ┣ 📜gameGroup.ts
 ┃ ┣ 📜post.ts
 ┃ ┣ 📜propsStateAndDispatch.ts
 ┃ ┣ 📜session.ts
 ┃ ┣ 📜stateInterface.ts
 ┃ ┣ 📜user.ts
 ┃ ┗ 📜usersGameGroup.ts
 ┣ 📂lib // when using 3rd party packages, if possible add them here.
 ┃ ┣ 📜axios.instance.ts
 ┃ ┗ 📜axios.interceptors.ts
 ┣ 📂models // initial state are created here
 ┃ ┣ 📂Post
 ┃ ┃ ┣ 📜postInitialState.ts
 ┃ ┣ 📂Session
 ┃ ┃ ┗ 📜sessionInitialState.ts
 ┃ ┗ 📂User
 ┃ ┃ ┗ 📜userInitialState.ts
 ┣ 📂routes
 ┃ ┣ 📜main.router.tsx
 ┃ ┗ 📜routes.config.tsx
 ┣ 📂store // for redux and thunk implementation add them here. Complex selectors are also added here
 ┃ ┣ 📂root
 ┃ ┃ ┣ 📜root_reducer.ts
 ┃ ┃ ┗ 📜root_store.ts
 ┃ ┣ 📂session
 ┃ ┃ ┣ 📜Actions.ts
 ┃ ┃ ┣ 📜Reducers.ts
 ┃ ┃ ┣ 📜Selectors.ts
 ┃ ┃ ┗ 📜Types.ts
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📜Actions.ts
 ┃ ┃ ┣ 📜Reducers.ts
 ┃ ┃ ┣ 📜Selectors.ts
 ┃ ┃ ┗ 📜Types.ts
 ┣ 📜index.css
 ┣ 📜index.tsx
 ┣ 📜react-app-env.d.ts
 ┣ 📜serviceWorker.ts
 ┗ 📜setupTests.ts
```
