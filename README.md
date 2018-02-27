# eslint-config-streamr

A shared `eslint` config between Streamr js projects. Has rules considering `es6`, `react` and `flow`.

### Usage

#### Setup
`npm i -D eslint babel-eslint eslint-config-streamr`

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