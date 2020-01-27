---
id: bugs
title: Bugs 🐞
sidebar_label: Bugs 🐞
---

Problem:

1. So I have this problem about running a migrations script when the application is running on docker. When I ran these npm scripts `npm run migration:run` `npm run migration:show`  I will get an error `Error: getaddrinfo ENOTFOUND db db:3306` so I have resulted to uncommenting the `host` and `port` and commenting the `host:db` in `ormconfig.ts` because when running the migration the `ormconfig.ts` is not being read. Heres my [stackover flow question](https://stackoverflow.com/questions/59639845/how-to-change-default-ip-on-mysql-using-dockerfile)

2. When running `npx typeorm entity:create -n <entity or model name>` this should create a file inside `src/models` but for some reason the file is being created inside the root folder. But if I changed `ormconfig.ts` to `ormconfig.json` cli will read the specified path. So to fix this you have to specify a path like `npx typeorm entity:create -n <entity or model name> -d <path name>`

