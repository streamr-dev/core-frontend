// @flow

// import 'babel-polyfill'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Route, Switch, StaticRouter } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { MDXProvider } from '@mdx-js/tag'

import LandingPage from './LandingPage'
// $flowfixme
import index from './index.ejs' // $flowfixme
import styles from './docs.pcss'

let components = {}
let history = {}
/*eslint-disable */
if (typeof global.document !== 'undefined') {
    const H1 = (props) => <h1 className={styles.mdH1} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
    const H2 = (props) => <h2 className={styles.mdH2} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
    const H3 = (props) => <h3 className={styles.mdH3} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
    const H4 = (props) => <h4 className={styles.mdH4} {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
    const Paragraph = (props) => (<p className={styles.mdP} {...props} />)
    components = {
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        p: Paragraph,
    }
    history = createHistory({
        basename: process.env.PLATFORM_BASE_PATH,
    })
}

export const App = () => (
    <ConnectedRouter history={history}>
        <MDXProvider components={components}>
            <Switch>
                <Route exact path="/docs" component={LandingPage} />
            </Switch>
        </MDXProvider>
    </ConnectedRouter>
)

export default (data: any) => {
    const assets = Object.keys(data.webpackStats.compilation.assets);
    const htmlWebpackPlugin = {
        files: {
            css: assets.filter(filename => filename.match(/\.css$/)).map(path => __webpack_public_path__ + '/' + path),
            js: assets.filter(filename => filename.match(/\.js$/)).map(path => __webpack_public_path__ + '/' + path)
        }
    }
    return index({
        htmlWebpackPlugin,
        content: renderToString(
            <StaticRouter location={data.path}>
                <LandingPage />
            </StaticRouter>
        )
    })
}
