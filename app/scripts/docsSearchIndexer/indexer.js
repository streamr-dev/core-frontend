/* eslint-disable no-console */
// NOTE: Script must be run with `npm run build-index`.
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
