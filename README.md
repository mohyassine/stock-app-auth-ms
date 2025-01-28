# Authentication microservice

## Table of contents

- [Run the service locally](#run-the-service-locally)
- [List of existing commands](#list-of-existing-commands)
- [APIS: routes, headers and parameters](#apis-routes-headers-and-parameters)
  - [List of routes](#list-of-routes)
  - [Headers](#headers)
  - [Check out the routes](#check-out-the-routes)
- [Tests](#tests)
- [Project Structure](#project-structure)
  - [lib](#lib)
    - [db](#db)
    - [errors](#errors)
    - [controllers](#controllers)
    - [services](#services)
    - [routers](#routers)
    - [route](#route)
    - [utils](#utils)
    - [validation](#validation)
  - [specs](#specs)
  - [test](#test)

## Run the service locally

```bash
yarn install
yarn start:dev
```

## Environment Variables

This template is configured to be deployed in three environments: `dev`, `uat` and `prod`. The corresponding env files can be found at `/lib/config/` folder: `dev.json`, `uat.json` and `prod.json` respectively.

By default, the server runs in `dev` environment.

## List of existing commands

| Command           | Description                                                                                                                    |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `yarn start`      | Starts the service in `dev` mode with `pm2`                                                                                    |
| `yarn start:uat`  | Starts the service in `uat` environment with `pm2`                                                                             |
| `yarn start:prod` | Starts the service in `prod` environment with `pm2`                                                                            |
| `yarn start:dev`  | Starts the service in development mode and runs using `nodemon` that restarts the service automatically when a file is changed |
| `yarn test`       | Runs all the dao, integration and unit tests                                                                                   |
| `yarn lint`       | Checks the linting of the project                                                                                              |

To deploy the project in a specific environment, a `deploy.sh` script can be run with:

- `deploy` or `bash ./deploy.sh`: to deploy in `dev` environment
- `deploy uat` or `bash ./deploy.sh uat`: to deploy in `uat` environment
- `deploy prod` or `bash ./deploy.sh prod`: to deploy in `prod` environment

## APIS: routes, headers and parameters

### List of routes

| HTTP Method | Route    | Description                          |
| :---------- | :------- | :----------------------------------- |
| `GET`       | `/`      | Default route                        |
| `GET`       | `/ready` | Checks if the server is up and ready |

All the routes of the microservice should be documented using `Swagger` in the project under `specs/`.

### Headers

The above routes don't require any headers.

A route can contain multiple headers. For example:

```bash
Authorization:Bearer <JWT_TOKEN>
Accept:application/vnd.nasco.<MS_SPECIFIC_ATTR>+json; version=1
Content-Type:application/json
```

_Note: `+json; version=1` can be opted from the `Accept` header_

### Check out the routes

- Get the root index

  ```bash
  curl -X GET \
  http://localhost:5000/ \
  ```

- Check if the server is up by getting the `ready` route.

  ```bash
  curl -X GET \
  http://localhost:5000/ready \
  ```

## Tests

To run the tests, the server should be running and mongoDB started

The tests include:

- **DAO**: to test the common MongoDB operations (insertOne, findOne, find, ...)
- **Unit Tests**: to test the functions and include all the possible use cases
- **Integration** Tests: To test the APIs and the server response by including all the possible use cases

In order to achieve this, we used `mocha` and `chai`.

## Project Structure

```bash
|- lib
|  |-- db
|  |-- errors
|  |-- config
|  |  |-- env
|  |-- controllers
|  |  |-- <api name>
|  |-- services
|  |-- routers
|  |-- routes
|  |-- utils
|  |-- validation
|  |  |--auth
|  |  |--db-scheme
|  |  |--version
|- specs
|- test
```

### lib

#### db

Includes database connection handling, common db collection methods, etc..

#### errors

Here you can find utlity functions to help you handle errors.

#### config/env

The folder contains the environment variables needed to run the service. Each file represents the environment specific variables and it is named correspondingly.

#### controllers

Includes subfolders with api names containing code that accepts the request and sends it to other corresponding modules and then handles the response or occuring errors.

#### services

This is where the business logic resides. It processes the requested oparations forwarded by the controller.

#### routers

Here are located the express routers. We have default and authenticated routers. The authenticated router is used for routes having the `Authorization` header holding the `Bearer` token.

#### route

Each route is located in a separated file to keep it clear.

#### utils

You can find here utility functions that could be used all aroud the project without having dependencies with other modules.

#### validation

This where you add header validations _(authorization)_, or version check for the `Accept` header or simply validating the request body.

### specs

Used for API documentation, written in YAML with OpenAPI 3.0 specification. Swagger preview tool would be helpful to view the specs and test. Also, a [public route](http://localhost:5000/api-docs) is generated after running the microservice so you can run and check available REST APIs.

### test

The automated test scripts live in this folder. It is separated into three sub folders:

- **DAO**: where we test the direct db manipulation functions
- **Unit**: where we test service functions
- **Integration**: where we perform end-to-end testing
