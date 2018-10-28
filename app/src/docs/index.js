// @flow

import 'babel-polyfill'
import React from 'react'
import { renderToString } from 'react-dom/server'
// import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'

// import { createStore, combineReducers } from 'redux'

// import GlobalInfoWatcher from '../marketplace/containers/GlobalInfoWatcher'
// import store from './store'
// import store from '../store'

import App from './App'
// $flowfixme
import index from './index.ejs' // $flowfixme

// import './layout'
/*eslint-disable */

// export default (data: any) => {
//     const assets = Object.keys(data.webpackStats.compilation.assets)
//     const htmlWebpackPlugin = {
//         files: { // $FlowFixMe
//             css: assets.filter((filename) => filename.match(/\.css$/)).map((path) => __webpack_public_path__ + path), // $FlowFixMe
//             js: assets.filter((filename) => filename.match(/\.js$/)).map((path) => __webpack_public_path__ + path), // $FlowFixMe
//         },
//     }
//     console.log(data.path)
//     // if (data.path.includes('docs')){
//         return index({
//             content: renderToString(
//                 <StaticRouter location={data.path}>
//                     {/* <Provider store={store}> */}
//                         <GlobalInfoWatcher>
//                             <App />
//                         </GlobalInfoWatcher>
//                     {/* </Provider> */}
//                 </StaticRouter>
//             ),
//         })
//     // } else return null
// }

// export default (data: any) => {
//     const assets = Object.keys(data.webpackStats.compilation.assets);
//     const css = assets.filter(value => value.match(/\.css$/));
//     const js = assets.filter(value => value.match(/\.js$/));
//     return index({ css, js, content: renderToString(<StaticRouter location={data.path}><App /></StaticRouter>)});
// }

export default (data: any) => {
    const assets = Object.keys(data.webpackStats.compilation.assets);
    let htmlWebpackPlugin = {
        files: {
            css: assets.filter(filename => filename.match(/\.css$/)).map(path => '/' + path),
            js: assets.filter(filename => filename.match(/\.js$/)).map(path => '/' + path)
        }
    };
    return index({
        htmlWebpackPlugin,
        content: renderToString(
            <StaticRouter location={data.path}>
                <App />
            </StaticRouter>
        )
    });
};
