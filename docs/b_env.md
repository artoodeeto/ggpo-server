---
id: b_env
title: Environment Variables 📝
sidebar_label: Environment Variables 📝
---

To configure environment variables first you have to change the `the_env_file.txt` to `.env` inside the root folder. All you need to change are the MYSQL values

These are the lists of keys and values that are needed to run the application:

```
# APPLICATION
NODE_ENV=development
API_VERSION=v1
PREFIX=api
# 3hours in milisec. this should be the same with OVERNIGHT_JWT_EXP
TOKEN_EXP=10800000

# BCRYPT
SALT_ROUNDS=11

# TYPEORM MODIFY AND USE THIS IN PRODUCTION

TYPEORM_CONNECTION=mysql
# docker service database name
TYPEORM_HOST=db
# not needed if run on docker
# although if you run npx typeorm to generat migration and or model you need to uncomment this and comment TYPEORM_HOST=db
# this is because of docker that I dont know for now
# TYPEORM_HOST=localhost
# not needed if run on docker
# TYPEORM_PORT=3306

TYPEORM_USERNAME=root
TYPEORM_PASSWORD=password
TYPEORM_DATABASE=development_db
TYPEORM_LOGGING=true
TYPEORM_ENTITIES=src/models/**/*.ts
TYPEORM_MIGRATIONS=db/migrations/**/*.ts
TYPEORM_SUBSCRIBERS=src/subscribers/**/*.ts
# typeorm used for crating migrations, entities and subscription
TYPEORM_ENTITIES_DIR=src/models
TYPEORM_MIGRATIONS_DIR=db/migrations
TYPEORM_SUBSCRIBERS_DIR=src/subscribers

# MYSQL
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=development_db

# Overnight js JWT package
OVERNIGHT_JWT_SECRET='dis iss sikrit misig'
OVERNIGHT_JWT_EXP='3h'
```
