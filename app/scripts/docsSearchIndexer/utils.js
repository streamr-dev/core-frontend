/* eslint-disable global-require, import/no-dynamic-require */
import docsMap from '../../src/docs/docsMap'

const fs = require('fs')
const remark = require('remark')
const remarkMdx = require('remark-mdx')
const strip = require('remark-mdx-to-plain-text')
const lunr = require('lunr')
const h2p = require('html2plaintext')
const canvasModules = require('../moduleReferences/canvasModuleHelpData.json')

const baseModuleRefPath = '/docs/module-reference/'
const searchStore = {}

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
 * Convenience function - Ensures first letter is a capital.
*/
const titleize = (text) => (text.charAt(0).toUpperCase() + text.slice(1))

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
    modules.forEach(({ refContent, refPath, refName, fullPath }) => {
        if (fullPath && refContent) {
            searchStore[`${fullPath}`] = {
                id: `${fullPath}`,
                content: generateModuleRefTextContent(refName, refPath, refContent),
                section: titleize(refPath),
                title: `Canvas Module: ${titleize(refName)}`,
            }
        }
    })
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
 * Save each docsPage to the search store.
*/
function commitMdxDocsPageToStore(path, section, title, mdxDocsPage) {
    searchStore[path] = {
        id: path,
        content: mdxDocsPage,
        section,
        title,
    }
}

/**
  * Process mdx files by iterating through the docs Pages
  * (except for root pages and the Module Reference section).
*/
export function processMdxDocsPages() {
    Object.keys(docsMap).forEach((section) => {
        if (section !== 'Module Reference') {
            Object.keys(docsMap[section]).forEach(async (page) => {
                if (page !== 'root') {
                    const { path, title, section: pageSection, filePath } = docsMap[section][page]
                    try {
                        const contentPage = require(`../../src/docs/content/${filePath}`)
                        await remark()
                            .use(remarkMdx)
                            .use(strip)
                            .process(contentPage, (err, file) => {
                                if (err) {
                                    throw err
                                }
                                commitMdxDocsPageToStore(path, pageSection, title, String(file))
                            })
                    } catch (error) {
                        console.warn(error)
                    }
                }
            })
        }
    })

    return searchStore
}

/**
 * With everything now ready, build the lunr index to memory.
 * The id is the 'key' that is returned from searches on the index,
 * that matches a key inside the search store object.
 * Fields (content, section and title) are searchable parts of every searchable entry.
*/
export function buildLunrIndex() {
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
