// TODO: Remove this file when userpages are production-ready. #userpages-on-demand
module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    transactionHistory: require('./modules/transactionHistory/reducer').default, // eslint-disable-line global-require
}
