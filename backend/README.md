<div align="center">
  <h1 align="center">
    <br>
    <a href="https://polycode.do-2021.fr"><img src="./docs/images/polybunny-do-2.webp" alt="PolyCode - Backend" width="200"></a>
    <br>
    PolyCode - Backend
    <br>
  </h1>

  <h4 align="center">Prepare yourself for coding interviews or learn new programming languages in minutes !</h4>

  <p align="center">
    <a href="https://polycode.do-2021.fr">
      <img src="https://img.shields.io/website?url=https%3A%2F%2Fpolycode.do-2021.fr"
      alt="Website status">
    </a>
    <a href="https://api.polycode.do-2021.fr">
      <img src="https://img.shields.io/website?label=api&url=https%3A%2F%2Fpolycode.do-2021.fr">
    </a>
  </p>

  <p align="center">
    <a href="#key-features">Key Features</a> •
    <a href="#how-to-use">How To Use</a> •
    <a href="#useful-commands">Useful Commands</a> •
    <a href="#credits">Credits</a> •
    <a href="#related">Related</a>
  </p>
</div>

## Key Features

* Build on top of [NestJS](https://nestjs.com) with [Express](https://expressjs.com)
* [TypeScript](https://www.typescriptlang.org) & ES 2022+
* Build with first class monorepo support thanks to [Nx](https://nx.dev)
* Monolith application
* PostgresSQl, Mongo as databases
* JWT Authentification with RBAC & policies
* Email sending with [AWS SES](https://aws.amazon.com/en/ses/)
* Hot reloading with [Watchman](https://facebook.github.io/watchman/)
* Run code in [Kubernetes](https://kubernetes.io/) with jobs
* Include charts deployment with [Helm](https://helm.sh/)

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)), [Docker](https://www.docker.com) and [Postgres CLI](https://www.pgcli.com) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone git@gitlab.polytech.umontpellier.fr:do-polycode/backend.git

# Go into the repository
$ cd backend

# Install dependencies
$ npm install

# Start databases and external services
$ docker-compose up -d

# Run the api
$ npm start api

# Populate databases
$ npm run populate-db

# Run the runner
$ npm start runner
```

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Useful Commands

#### Generate an application

Run `nx g @nrwl/nest:application my-app` to generate a nest application.

> You can use any of the plugins to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

#### Generate a library

Run `nx g @nrwl/nest:library my-lib` to generate a nest library.
Run `nx g @nrwl/node:library my-lib` to generate a node library.

> You can also use any of the plugins to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@polycode/my-lib`.

#### Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:3000/. The app will automatically reload if you change any of the source files.

#### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

#### Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Credits

This software uses the following open source packages:

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Nx](https://nx.dev)
- [Express](https://expressjs.com/)
- [PostgresSQL](https://www.postgresql.org/)
- [MongoDB](https://www.mongodb.com/)
- [Kubernetes](https://kubernetes.io/)

## Related

[polycode-frontend](https://gitlab.polytech.umontpellier.fr/do-polycode/backend) - Web version of PolyCode  
[polycode-ops](https://gitlab.polytech.umontpellier.fr/do-polycode/ops) - Operations management system for PolyCode
