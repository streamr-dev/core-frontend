import { setupAuthorizationHeader } from '$editor/shared/tests/utils'

import * as Services from '../services'
import * as Linking from '../state/linking'

import { canvasMatcher } from './utils'

describe('Adhoc Canvases', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000) // service can take some time to respond initially

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })

    describe('create adhoc canvas', () => {
        it('creates a new canvas', async () => {
            const parentCanvas = await Services.create()
            const adhocCanvas = await Services.createAdhocCanvas(parentCanvas)
            expect(adhocCanvas.id).not.toEqual(parentCanvas.id)
            expect(adhocCanvas).toMatchObject({
                ...parentCanvas,
                ...canvasMatcher,
                name: parentCanvas.name, // name identical (no deduping)
                adhoc: true, // created canvas is adhoc
                settings: expect.objectContaining({
                    parentCanvasId: parentCanvas.id, // captures parent canvas id
                }),
            })

            // check parent canvas linked
            expect(Linking.getLink(parentCanvas.id)).toEqual(adhocCanvas.id)
        })

        it('can unlink adhoc canvas', async () => {
            const parentCanvas = await Services.create()
            const adhocCanvas = await Services.createAdhocCanvas(parentCanvas)
            const updatedParentCanvas = await Services.unlinkAndLoadParentCanvas(adhocCanvas)
            // check canvases unlinked
            expect(Linking.getLink(parentCanvas.id)).not.toBeTruthy()
            expect(updatedParentCanvas).toMatchObject({
                ...parentCanvas,
                ...canvasMatcher,
            })
        })

        it('will load adhoc canvas as the "relevant" canvas', async () => {
            const parentCanvas = await Services.create()
            const adhocCanvas = await Services.createAdhocCanvas(parentCanvas)
            const loadedCanvas = await Services.loadRelevantCanvas(parentCanvas)
            expect(loadedCanvas).toMatchObject({
                ...adhocCanvas,
                ...canvasMatcher,
                id: adhocCanvas.id, // should have loaded adhoc canvas
            })
            await Services.unlinkAndLoadParentCanvas(adhocCanvas)
            const nextLoadedCanvas = await Services.loadRelevantCanvas(parentCanvas)
            expect(nextLoadedCanvas).toMatchObject({
                ...parentCanvas,
                ...canvasMatcher,
                id: parentCanvas.id, // should have loaded parent canvas
            })
        })

        it('will load parent canvas as the "relevant" canvas if adhoc canvas is missing', async () => {
            const parentCanvas = await Services.create()
            const adhocCanvas = await Services.createAdhocCanvas(parentCanvas)
            await Services.deleteCanvas({ id: adhocCanvas.id })

            const loadedCanvas = await Services.loadRelevantCanvas(parentCanvas)
            expect(loadedCanvas).toMatchCanvas(parentCanvas, {
                id: parentCanvas.id, // should have loaded adhoc canvas
            })

            expect(loadedCanvas).not.toHaveProperty('settings.childCanvasId')

            await Services.unlinkAndLoadParentCanvas(adhocCanvas)
            const nextLoadedCanvas = await Services.loadRelevantCanvas(parentCanvas)
            expect(nextLoadedCanvas).toMatchCanvas(parentCanvas, {
                id: parentCanvas.id, // should still have loaded parent canvas
            })
        })
    })
})

