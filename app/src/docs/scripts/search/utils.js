/* eslint-disable global-require, import/no-dynamic-require */
import docsMap from '../../docsMap'

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
 * Injest mdx as plain text.
*/
require.extensions['.mdx'] = function readMdx(module, filename) {
    const mdxFilename = filename
    const mdxModule = module
    mdxModule.exports = fs.readFileSync(mdxFilename, 'utf8')
}

/**
 * Sanitizer function.
*/
const toAnchor = (text) => (
    text.trim()
        .toLowerCase()
        .replace(' & ', ' and ')
        .replace(/\s+/g, '-')
)

/**
 * Generates formatted Module text content.
*/
const generateModuleRefTextContent = (name, path, content) => (
    `${name.charAt(0).toUpperCase() + name.slice(1)} (${path.charAt(0).toUpperCase() + path.slice(1)}). ${content}`
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
                section: `${refPath.charAt(0).toUpperCase() + refPath.slice(1)}`,
                title: `Canvas Module: ${refName.charAt(0).toUpperCase() + refName.slice(1)}`,
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
        const { path, name } = module

        modules.push({
            refContent: h2p(helpText).replace(/(\r\n|\n|\r)/gm, ''),
            refPath: toAnchor(path.split(':')[0].trim()),
            refName: toAnchor(name.split(':')[0].trim()),
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
                        const contentPage = require(`../../content/${filePath}`)
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
