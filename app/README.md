# Streamr Frontend App

The frontend app is being built on top of the existing Data Marketplace code and as such, some things will look unfinished while a more consolidated app is being built.

**Notes**

* Routes for the Editor and Userpage are temporarily added as part of the Marketplace app (however, these routes are disabled for production builds for now to keep the releasable bundle size smaller)

## Folder structure

Although the frontend consists of a single app, the code is structured into different folders based on the different functionalities of the app. The code is under the `src` folder:

* `auth` contains components for login
* `docs` contains the Streamr documentation
* `editor` is the visual programming environment for canvases
* `marketplace` contains the data marketplace
* `shared` has shared code and utilities
* `userpages` are the user's profile pages

## Getting Started

### Frontend

```
npm install
npm start
```

Webpack is configured with live reloading and will be served on http://localhost once the backend docker instance is running (see [Backend](#backend)).

### Documentation

The live documentation can be found at [streamr.com/docs](https://streamr.com/docs). The documentation content files are held in `/src/docs/content` as MDX files (jsx flavoured markdown). Community contributions are encouraged, please see the [Docs Editing Guide](https://github.com/streamr-dev/streamr-platform/app/src/docs/docsEditingGuide.md) for more information.


### Environment & Smart contract configuration

To be able to use the Marketplace, you'll need to configure these variables into your `.env` file:

| Variable                     | Description                                                          |
|------------------------------|----------------------------------------------------------------------|
| PORT                         | Port used by webpack devServer                                       |
| PLATFORM_ORIGIN_URL          | Base path/address of the current environment                         |
| STREAMR_API_URL              | Address of the environment's Backend Rest API                        |
| STREAMR_WS_URL               | Address of the environment's Backend Websocket API                   |
| STREAMR_URL                  | API Address for Dockerized Environments                              |
| MARKETPLACE_CONTRACT_ADDRESS | Address of the deployed Marketplace contract                         |
| TOKEN_CONTRACT_ADDRESS       | Address of the deployed Token contract                               |
| WEB3_REQUIRED_NETWORK_ID     | This is used to check that the user has selected the correct network |
| WEB3_PUBLIC_HTTP_PROVIDER    | A public provider used to query Marketplace methods without Metamask |
| WEB3_PUBLIC_WS_PROVIDER      | A public websocket prodiver (currently not in use)                   |
| BUNDLE_ANALYSIS              | Optional, enables generating bundle size analysis report.            |

Development values (set the values in your `.env`):

| Variable                     | Value                                        | Description                     |
|------------------------------|----------------------------------------------|---------------------------------|
| PORT                         | `3333`                                       |                                 |
| PLATFORM_ORIGIN_URL          | `http://localhost`                           |                                 |
| STREAMR_API_URL              | `http://localhost/api/v1`                    |                                 |
| STREAMR_WS_URL               | `ws://localhost:8890/api/v1/ws`              |                                 |
| STREAMR_URL                  | `http://localhost:8081/streamr-core`         |                                 |
| MARKETPLACE_CONTRACT_ADDRESS | `0x0af64558670a3b761B57e465Cb80B62254b39619` |                                 |
| TOKEN_CONTRACT_ADDRESS       | `0x8e3877fe5551f9c14bc9b062bbae9d84bc2f5d4e` |                                 |
| WEB3_REQUIRED_NETWORK_ID     | 4                                            | Rinkeby                         |
| WEB3_PUBLIC_HTTP_PROVIDER    | https://rinkeby.infura.io                    | Infura (Rinkeby)                |
| WEB3_PUBLIC_WS_PROVIDER      | wss://rinkeby.infura.io/ws                   | Infura (Rinkeby)                |
| BUNDLE_ANALYSIS              | 1                                            | PLATFORM_ORIGIN_URL/report.html |

Optional config values:

| Variable             | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| SENTRY_URL           | Identifier for Sentry error reporting service                |
| LOGROCKET_SLUG       | Identifier for LogRocket error reporting service (used in staging and public beta environment) |
| GOOGLE_ANALYTICS_ID  | Identifier for Google Analytics                              |
| STORYBOOK_BASE_PATH  | Build path for Storybook stories                             |
| PLATFORM_PUBLIC_PATH | Public path for Webpack config. If not defined, relative paths are used. |

Use `.travis.yml` to set the production values.

#### Routes

Marketplace: [/](/)

User Pages:  [/u/](/u)

Docs: [/docs](/docs)

### Backend

To run the app locally, you must install the docker environment to match what is in production. Follow the instructions here: https://github.com/streamr-dev/streamr-docker-dev

Note that the instructions also include login credentials for the local app. 

### Git Branches

Development Branch -> Local environment (bleeding edge)

Master Branch (untagged) -> Production ready code

Master Branch (tagged releases) -> Production code - https://streamr.com/marketplace

### Deploying to Staging

Merging a PR to `development` will trigger a release to staging. 

### Deploying to Production 

Follow these steps to push a new production release:

First check that there are no open tickets for critical/major bugs discovered on the development branch recently that should not be pushed to production.

To make life easier, nobody should push to the `development` branch while you're deploying, so let the team know you're deploying before you start.

```
git checkout master
git merge origin/development
npm version patch
git push
```

At this point it's a good idea to check that Travis confirms all tests are passing. Then,

```
git push origin <tag>
```

Following a deployment, `package.json` on `master` will have a higher version that on `development` so it's important to update `development` with this change.

```
git checkout development
git merge origin/master
git push
```

The parameter patch means updating the last number of the version, eg. 1.0.0 -> 1.0.1. Possible parameter values are [<VERSION>, patch, minor, major]

### Production Hotfixes

Create new branch from master `hotfix/ticket-id-issue-title` 
Merge the approved branch to master and push a tagged incremental release. 

```
npm version patch
git push 
```

At this point it's a good idea to check that Travis confirms all tests are passing. Then,

```
git push --tags
```

Remember to mirror the same fix in the `development` branch with new tests or new test conditions that prove the new functionality if required. 

### Adding new Features

```
git checkout development
git pull
git checkout -b ticket-id-issue-title
```

Then write your code, and get the pull request approved by two developers, ideally with tests proving the functionality. Then, merge the PR into `development`.

### Storybook

The project contains a Storybook including stories from the main components. The Storybook can be run with `npm run storybook` and built with `npm run build-storybook`.

## Deployment

- When production builds:
  - Webpack creates `.map`-file in `dist` -directory with bundled JS
  - Travis has a script container (Runs when deploying in production)
    - Creates a new release in Sentry by `TRAVIS_TAG`
    - Pushes source map -file from `dist` into Sentry with tagged release
    - Removes the `.map`-file so it doesn't end up in production

### Sentry

JavaScript error tracking from Sentry helps developers easily fix and prevent JavaScript errors in production as part of your commit-deploy-iterate workflow. Ask a powerful developer for access to the Sentry alerts.
