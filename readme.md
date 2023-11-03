# Table of content
- [Table of content](#table-of-content)
- [Welcome to scrapping](#welcome-to-scrapping)
  - [Installation](#installation)
  - [Docker (not mandatory)](#docker-not-mandatory)
  - [Env file (.env)](#env-file-env)
  - [Basic usage](#basic-usage)
    - [Import all data](#import-all-data)
    - [Import all data refreshed](#import-all-data-refreshed)
    - [Import a data fragment](#import-a-data-fragment)
  - [Configuring data](#configuring-data)

# Welcome to scrapping

> [!IMPORTANT]
> This program is for personal use only

## Installation

1. Go to the folder you want, as example ```cd ~```
2. Clone the project ```git clone https://github.com/r4ckham/scrapper.git```
3. Go to the created directory ```cd scrapper```
4. Install NPM dependencies ```npm install```
5. Add a **.env** file and adjust at your needs ```cp .env.example .env``` [(see documentation here)](#env-file-env)
6. Run the following command ```npm run sp:install```

## Docker (not mandatory)

For docker user run ```docker compose up -d```

## Env file (.env)

```conf
NODE_ENV=prod
HEADLESS_MODE=true
DATA_URL= URL TO POINT TO THE FILE
DOWNLOAD_FOLDER_TARGET= WHERE YOU WANT TO STORE THE FILE (inside project)
DOWNLOAD_FILE_TARGET= FILE NAME
BUTTON_DOWNLOAD_SELECTOR= SELECTOR FROM THE PAGE TARGETED

DATABASE_HOST= HOST
DATABASE_USER= USER
DATABASE_PASS= PASSWORD
DATABASE_PORT= PORT OF THE HOST
DATABASE_NAME= NAME OF THE DATABASE
DATABASE_ENGINE= ENGINE LIKE InnoDB

TABLE_NAME= TABLE NAME IN YOUR DATABASE
```

## Basic usage

There is multiple strategies.

### Import all data
> Master command

Run a full import
```npm run import```

Run a full import and refresh the csv file
```npm run  import -- --file=true```

Run a import for a small dataset
```npm run  import -- --postal-code=33000```

### Import all data refreshed

> Command to import newer data, it will erase all data and create new one

```npm run import:refresh```

### Import a data fragment

> Command to import a smaller set

```npm run import:palavas```

And if you want to reload the csv file :

```npm run import:palavas:refresh```

To import custom data, with the postal code of your choice you can run the following command :

```node --no-warnings App/main.js --postal-code=YOURPOSTALCODE```

---

> See more inside **package.json**

## Configuring data

If someday the reference of the targeted file came to change,
please update the file located on ```config/csv.resolver.config```


> For example  property of the file:
> ```json
>
>"epci": {
>    "file": "EPCI",
>    "database" : "epci"
>},
>```
>the **first** is for **code accessor**
>the **file** attribute is to reference the **CSV column name**
>the **database** attribute is to reference **the column name** in database table

Enjoy :rocket: