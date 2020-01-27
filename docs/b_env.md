---
id: b_env
title: Environment Variables 📝
sidebar_label: Environment Variables 📝
---


To configure environment variables first you have to create a `.env` file inside the root folder.

These are the list of keys and values that needs to run the application:

```
# APPLICATION
NODE_ENV=development
API_VERSION=v1
PREFIX=api

# BCRYPT
SALT_ROUNDS=11

# MYSQL
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=development_db

# Overnightjs JWT package
OVERNIGHT_JWT_SECRET='your secret message here'
OVERNIGHT_JWT_EXP='3h'
```

