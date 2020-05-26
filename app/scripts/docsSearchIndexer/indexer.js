/* eslint-disable no-console */
// NOTE: Script must be run with `npm run build-index`.

/**
 * *** Guide to adding content to the search index ***
 *
 * When adding new MDX pages to the Docs. You must make a new
 * entry inside the exported object from 'docsMap.js'. Follow the advice inside
 * that file. If you want to hide parts of the docs from the indexer,
 * use a conditional environmental flag inside docsMap.js to hide these pages.
 *
 * New canvas modules must be added/updated through the referenced
 * canvasModuleHelpData.json.
*/

import * as Sentry from '@sentry/node'

import {
    buildLunrIndex,
    processMdxDocsPages,
    processModuleReferenceDocs,
    commitModulesToStore,
    validateStores,
    saveStore,
    saveIndex,
} from './utils'

function initSentry() {
    Sentry.init({
        dsn: 'https://8311f8e7df9046b781600f95eefd1aa0@o151964.ingest.sentry.io/5235991',
    })
}

/**
 * Process the docs. Save the index & store as JSON files.
*/
(async function start() {
    console.log('Generating the Docs Search Index & Store...')
    initSentry()
    const modules = await processModuleReferenceDocs()
    const modulesStore = commitModulesToStore(modules)
    const pagesStore = await processMdxDocsPages()
    validateStores(pagesStore, modulesStore)
    const searchStore = Object.assign(modulesStore, pagesStore)
    const searchIndex = buildLunrIndex(searchStore)
    try {
        saveStore(searchStore)
        saveIndex(searchIndex)
    } catch (error) {
        console.log(error)
    }
}())
