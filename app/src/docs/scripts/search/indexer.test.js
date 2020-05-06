import { processModuleReferenceDocs, processMdxDocsPages } from './utils'

describe('Indexer', async () => {
    it('loads the correct number of modules', async () => {
        const mods = Object.keys(await processModuleReferenceDocs())
        expect(mods.length).toEqual(170)
    })
})
