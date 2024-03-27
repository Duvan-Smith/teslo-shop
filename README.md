<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

The Teslo shop API description

## Installation

```bash
$ npm install
```

Clonar el archivo __.env.template__ y renombrar la copia a __.env__

Llenar las variables de entorno definidas en el __.env__

## Database docker

Database up

```bash
$ docker-compose up
```
o
```bash
$ docker-compose up -d
```

## Database not docker

Create Database "```DB_NAME```" in PostgresSql

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Ejecutar Swagger
```bash
http://localhost:3000/api
```

## Ejecutar SEED
```bash
http://localhost:3000/api/seed
```

# Stack usado
* Nest Js
* Docker - DockerCompose
* PostgresSql