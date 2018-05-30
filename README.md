# Streamr Data Marketplace
The Data Marketplace is a storefront for the world’s data streams. It categorises, bundles, sorts and showcases all available data, 
both free and commercial on the Streamr Network, and acts as a single common interface for bringing together data buyers and sellers, 
who transact using $DATA. And we don’t take a transaction fee.

## Getting Started

### Frontend
```
npm install
npm start
```

Webpack is configured with hot reloading and will be served on http://localhost:3333

### Backend
To have the marketplace functional locally, you must install the docker envirnoment to match what is in production. Follow the instructions here: https://github.com/streamr-dev/streamr-docker-dev

Note that the instructions also include login credentials for the local marketplace app. 
## Project Structure
Development Branch -> Local environment (bleeding edge)

Master Branch (untagged) -> Production ready code

Master Branch (tagged releases) -> Production code - http://marketplace.streamr.com

### Deploying to Staging
A shared Staging environment does not exist yet. 
### Deploying to Production 
Follow these steps to push a new production release

```
git checkout master
git merge origin/development
npm version patch
git push
```

* At this point it's a good idea to check that Travis confirms all tests are passing. Then,

```
git push origin <tag>
```

The parameter patch means updating the last number of the version, eg. 1.0.0 -> 1.0.1. Possible parameter values are [<VERSION>, patch, minor, major]

### Production Hotfixes
Create new branch from master `hotfix/ticket-id-issue-title` 
Merge the approved branch to master and push a tagged incremental release. 

```
npm version patch
git push
```

* At this point it's a good idea to check that Travis confirms all tests are passing. Then,

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


## Deployment
- When production builds:
  - Webpack creates a `.map` file in the `build` directory from bundles JS.
  - Travis has script container (runs when deploying in production).
    - Creates a new release in Sentry by `TRAVIS_TAG`.
    - Pushes source map file from `build` into Sentry on tagged release.
  - Client has a `analytics.js` which tells Sentry on what release is run on
    - Maps with Sentry's source map

### Sentry
JavaScript error tracking from Sentry helps developers easily fix and prevent JavaScript errors in production as part of your commit-deploy-iterate workflow. 
Ask a powerful developer for access to the Sentry alerts.
