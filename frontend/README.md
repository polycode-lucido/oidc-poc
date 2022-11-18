<div align="center">
  <h1 align="center">
    <br>
    <a href="https://polycode.do-2021.fr"><img src="./src/images/polybunny-do.png" alt="PolyCode - Backend" width="200"></a>
    <br>
    PolyCode - Frontend
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

- Build on top of [NextJS](https://nextjs.org) with [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org) & ES 2022+
- Based on components brought by [MUI](https://mui.com), [Monaco Editor](https://microsoft.github.io/monaco-editor) and [React Markdown](https://github.com/remarkjs/react-markdown)
- Translation with [i18n-js](https://github.com/fnando/i18n-js)
- Monolith application
- Run code in [Kubernetes](https://kubernetes.io/) with jobs
- Include charts deployment with [Helm](https://helm.sh/)

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)), installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone git@gitlab.polytech.umontpellier.fr:do-polycode/frontend.git

# Go into the repository
$ cd frontend

# Create a .env file from .env.example
$ cp .env.example .env

# Install dependencies
$ npm install

# Run the app
$ npm start
```

> **WARNING**
> Environment variables beginning with `NEXT_PUBLIC_` are used at the build time.
> Do not forget to define them before building the application.
> They aren't required at runtime.

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Useful Commands

#### Development server

Run `npm run dev` for a dev server. Navigate to http://localhost:3000/ (or http://localhost:3001/ if another app is already running on this port). The app will automatically reload if you change any of the source files.

#### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `.next/` directory.

#### Running unit tests

Run `npm run test` to execute the unit tests via [Jest](https://jestjs.io).

#### Use git hooks

In order to help you not commit unformatted / unlinted code, we use git hooks that you can install with `npm run setup`.  
These hooks are setup with [husky](https://typicode.github.io/husky/).  
Furthermore, [`commit-lint`](https://commitlint.js.org/#/) is used to ensure you respects [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Contributing

To contribute to this repository, there are a few guidelines :

1. Create an issue with a descriptive title.
2. Create an associated Merge Request.
3. Perform modifications on your branch
4. When you're done, ensure you check all the Mark of the DoD
5. Great job, you're MR is ready to be reviewed 🚀

## Credits

This software uses the following open source packages:

- [Node.js](https://nodejs.org/)
- [NextJS](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [MUI](https://mui.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [i18n-js](https://github.com/fnando/i18n-js)
- [Kubernetes](https://kubernetes.io/)

## Related

[polycode-backend](https://gitlab.polytech.umontpellier.fr/do-polycode/backend) - PolyCode API  
[polycode-ops](https://gitlab.polytech.umontpellier.fr/do-polycode/ops) - Operations management system for PolyCode
