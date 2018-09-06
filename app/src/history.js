// @flow

import createHistory from 'history/createBrowserHistory'

export default createHistory({
    basename: process.env.MARKETPLACE_BASE_URL,
})
