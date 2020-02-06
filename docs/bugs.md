---
id: bugs
title: Bugs 🐞
sidebar_label: Bugs 🐞
---

Problem:

1. So I have this problem about running a migrations script when the application is running on docker. When I ran these npm scripts `npm run migration:run` `npm run migration:show`  I will get an error `Error: getaddrinfo ENOTFOUND db db:3306` so I have resulted to uncommenting the `host` and `port` and commenting the `host:db` in `ormconfig.ts` because when running the migration the `ormconfig.ts` is not being read. Heres my [stackover flow question](https://stackoverflow.com/questions/59639845/how-to-change-default-ip-on-mysql-using-dockerfile)

2. When running `npx typeorm entity:create -n <entity or model name>` this should create a file inside `src/models` but for some reason the file is being created inside the root folder. But if I changed `ormconfig.ts` to `ormconfig.json` cli will read the specified path. So to fix this you have to specify a path like `npx typeorm entity:create -n <entity or model name> -d <path name>`

3. If you get this error message after running test

```
The module '/Users/raphaelgako/Documents/aRtoo/dev_p/ggpo/server/node_modules/bcrypt/lib/binding/bcrypt_lib.node'
  was compiled against a different Node.js version using
  NODE_MODULE_VERSION 72. This version of Node.js requires
  NODE_MODULE_VERSION 64. Please try re-compiling or re-installing
  the module (for instance, using `npm rebuild` or `npm install`).
  
    at Runtime._loadModule (node_modules/jest-runtime/build/index.js:572:29)
    at Object.<anonymous> (node_modules/bcrypt/bcrypt.js:6:16)
```

It means that your version of node inside the project is different. To fix this you can run `nvm use` inside the root backend folder.
This happened to me every time I turned off my computer. This error is because bcrypt was compiled using a different version of node.
So when you have this error try running `node --version` and check the `.nvmrc` if its different then you will have this problem. 