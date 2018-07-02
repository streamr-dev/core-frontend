# eslint-config-streamr

A shared `eslint` config between Streamr js projects. Has rules considering `es6`, `react` and `flow`. Extends [`eslint-config-airbnb`](https://www.npmjs.com/package/eslint-config-airbnb), but has some other rules on top of that. Please see [`.eslintrc.js`](./.eslintrc.js) for the ruleset.

### Usage

#### Setup
First install the package with
```
npm i -D eslint-config-streamr
```

Then install the peer dependencies. The easiest way to do this is with `npx` (`npm` > 5.2.0):
```
npx install-peerdeps [-d] eslint-config-streamr
```
`-d` is to install them as `devDependencies`


#### Config
In your `.eslintrc.json` (or `.js`) file you must extend `eslint-config-streamr`:
```
{
  extend: 'eslint-config-streamr'
}
```
OR use alias
```
{
  extend: 'streamr'
}
```
