CREATE DATABASE IF NOT EXISTS production_db;
CREATE DATABASE IF NOT EXISTS development_db;

USE development_db;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT,
	username VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

INSERT INTO users (
	username,
	email,
	password
) VALUES 
(
	'test1',
	'test1@gmail.com',
	'password'
),
(
	'test2',
	'test2@yahoomail.com',
	'password'
),
(
	'test3',
	'test3@yahoomail.com',
	'password'
)