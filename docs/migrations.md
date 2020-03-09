---
id: migrations
title: Migrations
sidebar_label: Migrations
---

Migrations are essential to our development, it somewhat self documenting. We are able to track on whats happening in our database. Typeorm have a connivent way of creating, showing, and running migrations.

## Creating a migration

To create a migration you have to be inside the root folder. Then you can run the command `npx typeorm migration:create -n MigrationName`. This will create a file inside the `db/migrations` folder. As of right now we don't have a convention in naming our migration, but it would be cool if we have one.

## Running a migration

After creating a migration you have to run it. I created a script inside the `package.json` to run our migration. Just run the command `npm run migration:run` it will detect migrations that haven't been ran.

## Showing ran and not ran migration

To check if the migration has ran. Run the command `npm run migration:show`

## Reverting migration

If you have a mistake on the migration that you ran, you can revert it by running `npm run migration:revert`

---

For more details about migration checkout [typeorm migrations](https://typeorm.io/#/migrations)

**Note:** Before a running, showing, and reverting a migration. On the the `.env` file you to comment `TYPEORM_HOST=db` and uncomment `TYPEORM_HOST=localhost`, then if its successful uncomment `TYPEORM_HOST=db` and comment `TYPEORM_HOST=localhost`
