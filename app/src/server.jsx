import path from 'path'
import express from 'express'
import cors from 'cors'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter /* , matchPath */ } from 'react-router-dom'
// import serialize from 'serialize-javascript'
import App from './marketplace/components/App'
// import routes from '../shared/routes'

const app = express()

app.use(cors())
app.use(express.static('dist/public'))
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

    const markup = renderToString((
        <StaticRouter location={req.url} context={{}}>
            <App />
        </StaticRouter>
    ))

    res.render('index', {
        gaId: process.env.GOOGLE_ANALYTICS_ID,
        cssBundleSrc: path.join('main.css'),
        jsBundleSrc: path.join('bundle.js'),
        markup,
    })
    // }).catch(next)
})

const port = 3000
app.listen(port, () => {
    console.info(`Server is listening on port: ${port}`) // eslint-disable-line no-console
})
