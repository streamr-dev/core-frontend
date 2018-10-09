// TODO: Remove this file when userpages are production-ready.
module.exports = (process.env.USERPAGES === 'on' ?
    require('./index.jsx') : require('./stub.jsx') // eslint-disable-line global-require
).default
