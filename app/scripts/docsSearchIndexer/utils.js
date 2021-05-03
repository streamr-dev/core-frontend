/* eslint-disable global-require, import/no-dynamic-require */
import docsMap from '../../src/docs/docsMap'

const fs = require('fs')
const remark = require('remark')
const remarkMdx = require('remark-mdx')
const strip = require('remark-mdx-to-plain-text')
const lunr = require('lunr')

/**
 * Loads MDX as plain text.
*/
require.extensions['.mdx'] = function readMdx(module, filename) {
    const mdxFilename = filename
    const mdxModule = module
    mdxModule.exports = fs.readFileSync(mdxFilename, 'utf8')
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
        const pages = Object.keys(docsMap[section])
        pages.forEach((page) => {
            // Include root page only if it's the only available page
            if (pages.length <= 1 || page !== 'root') {
                fileInfos.push({
                    filePath: docsMap[section][page].filePath,
                    path: docsMap[section][page].path,
                    section: docsMap[section][page].section,
                    title: docsMap[section][page].title,
                })
            }
        })
    })

    return fileInfos
}

/**
  * Process mdx files by iterating through the docs Pages
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
