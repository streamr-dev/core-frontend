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


### Smart contract configuration

To be able to use the Marketplace, you'll need to configure these variables into your `.env` file:

| Variable                     | Description                                                          |
|------------------------------|----------------------------------------------------------------------|
| MARKETPLACE_CONTRACT_ADDRESS | Address of the deployed Marketplace contract                         |
| TOKEN_CONTRACT_ADDRESS       | Address of the deployed Token contract                               |
| WEB3_REQUIRED_NETWORK_ID     | This is used to check that the user has selected the correct network |
| WEB3_PUBLIC_HTTP_PROVIDER    | A public provider used to query Marketplace methods without Metamask |
| WEB3_PUBLIC_WS_PROVIDER      | A public websocket prodiver (currently not in use)                   |

Development values (set the values in your `.env`):

| Variable                     | Value                                        | Description      |
|------------------------------|----------------------------------------------|------------------|
| MARKETPLACE_CONTRACT_ADDRESS | `0x0af64558670a3b761B57e465Cb80B62254b39619` |                  |
| TOKEN_CONTRACT_ADDRESS       | `0x8e3877fe5551f9c14bc9b062bbae9d84bc2f5d4e` |                  |
| WEB3_REQUIRED_NETWORK_ID     | 4                                            | Rinkeby          |
| WEB3_PUBLIC_HTTP_PROVIDER    | https://rinkeby.infura.io                    | Infura (Rinkeby) |
| WEB3_PUBLIC_WS_PROVIDER      | wss://rinkeby.infura.io/ws                   | Infura (Rinkeby) |

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

### URL List
#### Public Site Pages
Landing Page: "/"
About Us: "/about"
FAQ: "/faq"

#### Core Pages
Marketplace - Browse Listings: "/marketplace"
Marketplace - Product Details: "/marketplace/products/product_id"
Marketplace - Product Stream Preview: "/marketplace/products/product_id/streamPreview/stream_id"
Marketplace - Create Product: "/marketplace/products/create"
Marketplace - Edit Product: "/marketplace/products/products/product_id/edit"
Core Editor - New Canvas: "/canvas/editor"
Core Editor - Edit Canvas: "/canvas/editor/canvas_id"
Core Editor - New Dashboard: "/dashboard/editor"
Core Editor - Edit Dashboard: "/dashboard/editor/dashboard_id"
Core Pages - Signup: "/register/signup"
Core Pages - Login: "/login"
Core Pages - Home: "/u"
Core Pages - Canvases: "/u/canvases"
Core Pages - Dashboards: "/u/dashboards"
Core Pages - Streams: "/u/streams"
Core Pages - Stream Creation: "/u/stream/show"
Core Pages - Stream Edit: "/u/stream/show/stream_id"
Core Pages - Stream Preview: "u/stream/preview/stream_id"
Core Pages - Products: "/u/products"
Core Pages - Purchases: "/u/purchases"
Core Pages - Transactions: "/u/transactions"
Core Pages - User Settings: "/u/profile/edit"
Docs - Home : "/docs"
Docs - Introduction: "/docs/introduction"
Docs - Tutorials: "/docs/tutorials"
Docs - Visual Editor: "/docs/visual-editor"
Docs - Streamr Engine: "/docs/streamr-engine"
Docs - Data Marketplace: "/docs/data-marketplace"
Docs - Api: "/docs/streamr-api"
Docs - UserPages: "/docs/userpage"
*Catch all* :  "/404"
