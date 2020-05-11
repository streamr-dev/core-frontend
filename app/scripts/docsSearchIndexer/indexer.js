/* eslint-disable no-console */
import {
    buildLunrIndex,
    processMdxDocsPages,
    processModuleReferenceDocs,
    commitModulesToStore,
} from './utils'

const fs = require('fs')

/**
 * Write Store to disk.
*/
function saveStore(searchStore) {
    fs.writeFileSync('../../src/docs/components/Search/index/store.json', JSON.stringify(searchStore), (err) => {
        if (err) {
            throw err
        }
    })
}

/**
 * Write Index to disk.
*/
function saveIndex(searchIndex) {
    fs.writeFileSync('../../src/docs/components/Search/index/index.json', JSON.stringify(searchIndex), (err) => {
        if (err) {
            throw err
        }
    })
}

/**
 * Process the docs. Save the index & store as JSON files.
*/
(async function start() {
    console.log('Generating the Docs Search Index & Store...')
    const modules = await processModuleReferenceDocs()
    commitModulesToStore(modules)
    const searchStore = processMdxDocsPages()
    const searchIndex = buildLunrIndex()
    saveStore(searchStore)
    saveIndex(searchIndex)
}())

// Future TODO: Index external Readme resources
// const fetch = require('node-fetch')
// function genReadmeDocs() {
//     console.log('enter genReadmeDocs()')
//     fetch('https://raw.githubusercontent.com/streamr-dev/streamr-client-protocol-js/master/README.md')
//         .then(res => res.text())
//         .then(body => console.log(body));
// }
