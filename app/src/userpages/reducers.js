// TODO: Remove this file when userpages are production-ready. #userpages-on-demand
module.exports = {
    permission: require('./modules/permission/reducer').default, // eslint-disable-line global-require
    transactionHistory: require('./modules/transactionHistory/reducer').default, // eslint-disable-line global-require
}
