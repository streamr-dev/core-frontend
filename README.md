# eslint-config-streamr

A shared `eslint` config between Streamr js projects. Has rules considering `es6`, `react` and `flow`.

### Usage

#### Setup
First install the package with
```
npm i -D eslint-config-streamr
```

Then install the peer dependencies. They can be listed with
```
npm info eslint-config-streamr peerDependencies
```
Then install each of them with
```
npm i -D <dependency>@<version>
```


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