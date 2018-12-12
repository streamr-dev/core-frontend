/**
 * This file is a temporal solution to merge SSR without actually using it in production.
 *
 * The whole file and the related parts in webpack.config.js, travis_scripts and travis.yml should be removed after
 * the SSR works in production and staging as well.
 */

import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import React from 'react'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Frontload } from 'react-frontload'
import mapValues from 'lodash/mapValues'
import App from '../src/marketplace/components/App'
import createStore from '../src/store'

const { PLATFORM_BASE_PATH } = process.env

const basePath = PLATFORM_BASE_PATH || '/'

// these are relative to the root
const SOURCE_FILE = './src/views/index.ejs'
const DIST_FILE = './dist_browser/index.html'

const { store } = createStore('/')

renderToString((
    <Provider store={store}>
        <StaticRouter
            location="/"
            basename={basePath}
            context={{}} // Don't really know what this is but it has to be there - aapzu
        >
            <Frontload noServerRender>
                <App />
            </Frontload>
        </StaticRouter>
    </Provider>
))

const helmet = mapValues(Helmet.renderStatic(), (val) => val.toString())

ejs.renderFile(SOURCE_FILE, {
    cssBundleSrc: path.resolve(basePath, 'main.css'),
    jsBundleSrc: path.resolve(basePath, 'bundle.js'),
    ...helmet,
}, {}, (err, str) => {
    if (err) {
        throw err
    }
    fs.writeFileSync(DIST_FILE, str)
    console.log('Ready!')
    process.exit(0)
})
