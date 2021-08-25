FROM mysql:8.0.18
# RUN "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';"
# RUN "FLUSH PRIVILEGES;"
# ENV MYSQL_DATABASE development_db
# ENV MYSQL_ROOT_PASSWORD password
# ENV MYSQL_PASSWORD password

# dont use this on mysql docker
# ENV MYSQL_USER root
# ENV DATABASE_HOST db

EXPOSE 3306
COPY ./init_db.sql /docker-entrypoint-initdb.d/