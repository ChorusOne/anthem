# Anthem by Chorus One

This is the codebase for Anthem, a multi-network platform for managing blockchain proof-of-stake networks. Anthem is open source and built and maintained by [Chorus One](https://chorus.one/).

<img width="1437" alt="Anthem" src="https://user-images.githubusercontent.com/18126719/77608287-b5bb2480-6f57-11ea-88b9-04d146fb8ca3.png">

---

### Getting Started

- Clone the repo: `git clone https://github.com/ChorusOne/anthem.git`.
- Install [NodeJS](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/lang/en/docs/).
- Use Node LTS: `nvm install lts/* && nvm alias default lts/*`.
- Run `yarn` to install dependencies.
- Run `yarn setup` to setup environment variables.
- Run `yarn server:start` to start the server.
- Run `yarn client:start` to start the client.
- Run `yarn dev` to start the client in test/development mode.
- Run `yarn test` to run the project unit tests.

### Docker Images

The docker image for the Anthem backend server can be found on [Docker Hub](https://hub.docker.com/r/chorusone/anthem). The latest release is kept up to date with the master branch of this repository.

A docker image for the frontend application will be available shortly.

### Kubernetes

A Kubernetes manifest file for the backend server is included in `packages/server/anthem.yaml.dist`.

## Contributing

We use the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for developing new features. This involves pulling the `master` branch, developing your fix or feature on a new branch, and then creating a pull request for your code changes. It is recommended to try to keep pull requests simple and confined to a concise set of changes to make it easy to review and merge code. Pull requests require review and all status checks (continuous integration checks, for instance) to pass before merging is allowed.

When merging code we recommend choosing the "Squash and Merge" option to reduce all your pull request commits to a single commit on the `master` branch. This approach should get the primary git history clear. For example, maybe you have 15 commits on a branch where you develop a new feature but then squash these to a single commit `Implement settings page and components`. If the commit should contain additional context, it can be included in the commit description.
