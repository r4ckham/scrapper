# Welcome to scrapping

> This program is to personal use only

## Installation

1. Go to the folder you want, as example ```cd ~```
2. Clone the project ```git clone git@github.com:r4ckham/scrapper.git```
3. Go to the created directory ```cd scrapper```
4. Install NPM dependencies ```npm install```
5. Run the following command ```npm run sc:install```

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
> Command to import all data

```npm run import:all```

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