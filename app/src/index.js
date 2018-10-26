// @flow

import 'babel-polyfill'
import React from 'react'
// import { renderToString } from 'react-dom/server'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './marketplace/components/App'
import GlobalInfoWatcher from './marketplace/containers/GlobalInfoWatcher'
import store from './store'
import './setup'
import './layout'
// $FlowFixMe
// import index from './index.ejs'

/*eslint-disable */
const root = document.getElementById('root')
if (root) {
    ReactDOM.render(
        <BrowserRouter>
            <Provider store={store}>
                <GlobalInfoWatcher>
                    <App />
                </GlobalInfoWatcher>
            </Provider>
        </BrowserRouter>,
        root,
    )
}

// export default (data: any) => {
//     const assets = Object.keys(data.webpackStats.compilation.assets)
//     const htmlWebpackPlugin = {
//         files: { // $FlowFixMe
//             css: assets.filter((filename) => filename.match(/\.css$/)).map((path) => __webpack_public_path__ + path), // $FlowFixMe
//             js: assets.filter((filename) => filename.match(/\.js$/)).map((path) => __webpack_public_path__ + path), // $FlowFixMe
//         },
//     }
//     console.log(data.path)
//     if (data.path.includes('docs')){
//         return index({
//             content: renderToString(
//                 <StaticRouter location={data.path}>
//                     <Provider store={store}>
//                         <GlobalInfoWatcher>
//                             <App />
//                         </GlobalInfoWatcher>
//                     </Provider>
//                 </StaticRouter>
//             ),
//         })
//     } else return null
// }
