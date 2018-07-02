// @flow

import createHistory from 'history/createBrowserHistory'

const basename = process.env.MARKETPLACE_URL.replace(window.location.origin, '')

export default createHistory({
    basename,
})
