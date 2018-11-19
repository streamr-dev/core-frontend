# Streamr Frontend App

The frontend app is being built on top of the existing Data Marketplace code and as such, some things will look unfinished while a more consolidated app is being built.

**Notes**

* Routes for the Editor and Userpage are temporarily added as part of the Marketplace app (however, these routes are disabled for production builds for now to keep the releasable bundle size smaller)

## Folder structure

Although the frontend consists of a single app, the code is structured into different folders based on the different functionalities of the app. The code is under the `src` folder:

* `auth` contains components for login
* `docs` has a prototype implementation for the new user documentation (the current documentation is at https://www.streamr.com/help/api)
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

Webpack is configured with live reloading and will be served on http://localhost/platform once the backend docker instance is running (see [Backend](#backend)).

By default, user pages and docs are disabled from builds. To turn them on, add an `.env` file under the `app` folder to turn them on:

```
USERPAGES=on
DOCS=on
```

The current UI does not link to the new pages but you have to instead go to http://localhost/platform/u to view the user pages. You must also be signed in to see any content.

#### Routes

Marketplace: [/platform/](/platform/)

User Pages:  [/platform/u/](/platform/u/)

Component library: [/platform/components](/platform/components)

Docs: [/platform/docs](/platform/docs)

### Backend

To run the app locally, you must install the docker environment to match what is in production. Follow the instructions here: https://github.com/streamr-dev/streamr-docker-dev

Note that the instructions also include login credentials for the local app. 

### Git Branches

Development Branch -> Local environment (bleeding edge)

Master Branch (untagged) -> Production ready code

Master Branch (tagged releases) -> Production code - https://marketplace.streamr.com

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