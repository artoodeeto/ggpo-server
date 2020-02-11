---
id: bugs
title: Bugs 🐞
sidebar_label: Bugs 🐞
---

Problem:

1. So I have this problem about running a migrations script when the application is running on docker. When I ran these npm scripts `npm run migration:run` `npm run migration:show`  I will get an error `Error: getaddrinfo ENOTFOUND db db:3306`, so the fix for now is to uncomment `TYPEORM_HOST=localhost` and commenting `TYPEORM_HOST=db` inside the `.env` file, then after I finished running the scripts, I comment `TYPEORM_HOST=localhost` and uncomment `TYPEORM_HOST=db` so the server could run normally. I think the reason for this is that when running the npm scripts, its outside the environment of docker. Im trying to figure out a fix for this but this is a least priority. I have an old question about this from stackover flow. [stackover flow question](https://stackoverflow.com/questions/59639845/how-to-change-default-ip-on-mysql-using-dockerfile)

2. If you get this error message after running test

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