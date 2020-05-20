import { processModuleReferenceDocs, commitModulesToStore } from './utils'

describe('Indexer utils', () => {
    it('loads the correct number of modules', async () => {
        const mods = Object.keys(await processModuleReferenceDocs())
        expect(mods.length).toEqual(170)
    })

    it('generated module docs URLs do not contain spaces', async () => {
        const mods = await processModuleReferenceDocs()
        const modsStore = commitModulesToStore(mods)
        const spaceInUrl = []
        Object.keys(modsStore).forEach((item) => {
            if (item.includes(' ') || modsStore[item].id.includes(' ')) {
                spaceInUrl.push(true)
            }
        })
        expect(spaceInUrl.length).toEqual(0)
    })
})
