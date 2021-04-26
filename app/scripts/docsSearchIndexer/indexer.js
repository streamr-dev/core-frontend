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
    saveStore,
    saveIndex,
} from './utils'

function initSentry() {
    if (process.env.SENTRY_INDEXER_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_INDEXER_DSN,
            release: process.env.VERSION,
            debug: true,
        })
    }
}

/**
 * Process the docs. Save the index & store as JSON files.
*/
(async function start() {
    console.log('Generating the Docs Search Index & Store...')
    initSentry()
    const pagesStore = await processMdxDocsPages()

    if (!pagesStore) {
        throw new Error('Docs Pages not found!')
    }

    const searchStore = Object.assign(pagesStore)
    const searchIndex = buildLunrIndex(pagesStore)
    try {
        saveStore(searchStore)
        saveIndex(searchIndex)
    } catch (error) {
        console.log(error)
    }
}())
