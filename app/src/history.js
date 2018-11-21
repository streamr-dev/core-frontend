// @flow

import createHistory from 'history/createBrowserHistory'

export default () => createHistory({
    basename: process.env.PLATFORM_BASE_PATH,
})
