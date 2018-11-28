import path from 'path'
import express from 'express'
import cors from 'cors'
import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { StaticRouter /* , matchPath */ } from 'react-router-dom'
// import serialize from 'serialize-javascript'
import App from './marketplace/components/App'
import createStore from './store'

const app = express()

const basePath = process.env.PLATFORM_BASE_PATH || '/'
app.use(cors())
app.use(basePath, express.static('./dist_browser'))
app.set('view engine', 'ejs')
app.set('views', './src/views')

app.get('*', (req, res) => {
    // const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}
    //
    // const promise = activeRoute.fetchInitialData
    //     ? activeRoute.fetchInitialData(req.path)
    //     : Promise.resolve()

    // promise.then((data) => {
    // const context = { data }

    const { store } = createStore(req.url)

    const markup = renderToString((
        <Provider store={store}>
            <StaticRouter location={req.url} basename={basePath} context={{}}>
                <App />
            </StaticRouter>
        </Provider>
    ))

    res.render('index', {
        gaId: process.env.GOOGLE_ANALYTICS_ID,
        cssBundleSrc: path.join('main.css'),
        jsBundleSrc: path.join('bundle.js'),
        markup,
    })
    // }).catch(next)
})

const port = 3333
app.listen(port, () => {
    console.info(`Server is listening on port: ${port}`) // eslint-disable-line no-console
})
