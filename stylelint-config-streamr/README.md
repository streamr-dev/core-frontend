# stylelint-config-streamr

A shared `stylelint` config between Streamr's web projects. Can be used for all usual kinds of `.css`, `.pcss` and `.scss` files.

### Usage

#### Setup
Install the package and stylelint with
```
npm i -D stylelint stylelint-config-streamr
```

#### Config
In your `.stylelintrc` file you must extend `stylelint-config-streamr`:
```
{
  extends: [
    'stylelint-config-streamr',
  ]
}
```
