/* eslint-disable global-require, import/no-dynamic-require */
import docsMap from '../../src/docs/docsMap'

const fs = require('fs')
const remark = require('remark')
const remarkMdx = require('remark-mdx')
const strip = require('remark-mdx-to-plain-text')
const lunr = require('lunr')
const h2p = require('html2plaintext')
const { titleize } = require('@streamr/streamr-layout')
const canvasModules = require('../moduleReferences/canvasModuleHelpData.json')

const baseModuleRefPath = '/docs/module-reference/'

/**
 * Loads MDX as plain text.
*/
require.extensions['.mdx'] = function readMdx(module, filename) {
    const mdxFilename = filename
    const mdxModule = module
    mdxModule.exports = fs.readFileSync(mdxFilename, 'utf8')
}

/**
 * Convert category name into suitable anchor
 * e.g. Time & Date -> time-and-date
 * NB: Must match toAnchor from the Platorm: src/docs/components/Pages/ModuleReference/data.js
*/
const toAnchor = (text) => (
    text.trim()
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/\s+/g, '-')
)

/**
 * Generates formatted Module text content.
*/
const generateModuleRefTextContent = (name, path, content) => (
    `${titleize(name)} (${titleize(path)}). ${content}`
)

/**
 * Saves formatted Modules with meta data to the search store.
*/
export function commitModulesToStore(modules) {
    const modulesStore = {}
    modules.forEach(({ refContent, refPath, refName, fullPath }) => {
        if (fullPath && refContent) {
            modulesStore[`${fullPath}`] = {
                id: `${fullPath}`,
                content: generateModuleRefTextContent(refName, refPath, refContent),
                section: titleize(refPath),
                title: `Canvas Module: ${titleize(refName)}`,
            }
        }
    })

    return modulesStore
}

/**
 * Iterates through the Module Reference Help JSON file source of truth.
 * Generates formatted meta information about each Module.
*/
export async function processModuleReferenceDocs() {
    const modules = []

    canvasModules.forEach((module) => {
        const { helpText } = module.help
        let { path, name } = module

        // Take the first part of: "Integrations: Ethereum"
        path = toAnchor(path.split(':')[0])
        name = toAnchor(name.split(':')[0])

        modules.push({
            refContent: h2p(helpText).replace(/(\r\n|\n|\r)/gm, ''),
            refPath: path,
            refName: name,
            fullPath: `${baseModuleRefPath}${path}#${name}`,
        })
    })

    return modules
}

/**
  * Extract plain text from the MDX files and add the necessary metaData to the
  * entry to create valid store entries.
*/
async function getPageContents(fileInfos) {
    return Promise.all(fileInfos.map((fileInfo) => {
        const contentPage = require(`../../src/docs/content/${fileInfo.filePath}`)
        const { path, section, title } = fileInfo
        return new Promise((resolve, reject) => {
            remark()
                .use(remarkMdx)
                .use(strip)
                .process(contentPage, (err, file) => {
                    if (err) {
                        reject(err)
                    }
                    resolve({
                        id: path,
                        content: String(file),
                        section,
                        title,
                    })
                })
        })
    }))
}

/**
  * Helper function to get filter the file information requried to
  * cleanly loop through the file read promises.
*/
function getFileInfos() {
    const fileInfos = []
    Object.keys(docsMap).forEach((section) => {
        if (section !== 'Module Reference') {
            Object.keys(docsMap[section]).forEach((page) => {
                if (page !== 'root') {
                    fileInfos.push({
                        filePath: docsMap[section][page].filePath,
                        path: docsMap[section][page].path,
                        section: docsMap[section][page].section,
                        title: docsMap[section][page].title,
                    })
                }
            })
        }
    })

    return fileInfos
}

/**
  * Process mdx files by iterating through the docs Pages
  * (except for root pages and the Module Reference section).
*/
export async function processMdxDocsPages() {
    const pagesStore = {}
    const fileInfos = getFileInfos()
    const pages = await getPageContents(fileInfos)

    pages.forEach((page) => {
        pagesStore[page.id] =
        {
            ...page,
        }
    })

    return pagesStore
}

/**
 * With everything now ready, build the lunr index to memory.
 * The id is the 'key' that is returned from searches on the index,
 * that matches a key inside the search store object.
 * Fields (content, section and title) are searchable parts of every searchable entry.
*/
export function buildLunrIndex(searchStore) {
    const idx = lunr(function build() {
        this.ref('id')
        this.field('content')
        this.field('section')
        this.field('title')
        this.metadataWhitelist = ['position']

        Object.values(searchStore).forEach(function addDoc(doc) { this.add(doc) }, this)
    })

    return idx
}

/**
 * Ensures we don't override the store with an empty store.
*/
export function validateStores(pagesStore, modulesStore) {
    if (!pagesStore) {
        throw new Error('Docs Pages not found!')
    }
    if (!modulesStore) {
        throw new Error('Canvas Modules not found!')
    }
}

/**
 * Write Store to disk.
*/
export function saveStore(searchStore) {
    if (!searchStore || !Object.keys(searchStore).length) {
        throw new Error('Store cannot be empty')
    }

    fs.writeFile('./src/docs/components/Search/index/store.json', JSON.stringify(searchStore), (err) => {
        if (err) {
            throw err
        }
    })
}

/**
 * Write Index to disk.
*/
export function saveIndex(searchIndex) {
    if (!searchIndex || !Object.keys(searchIndex).length) {
        throw new Error('Index cannot be empty')
    }

    fs.writeFile('./src/docs/components/Search/index/index.json', JSON.stringify(searchIndex), (err) => {
        if (err) {
            throw err
        }
    })
}

// Future TODO: Index external Readme resources
// const fetch = require('node-fetch')
// function genReadmeDocs() {
//     console.log('enter genReadmeDocs()')
//     fetch('https://raw.githubusercontent.com/streamr-dev/streamr-client-protocol-js/master/README.md')
//         .then(res => res.text())
//         .then(body => console.log(body));
// }
