import { setupAuthorizationHeader } from '$editor/shared/tests/utils'

import * as Services from '../services'

const canvasMatcher = {
    id: expect.any(String),
    name: expect.any(String),
    created: expect.any(String),
    updated: expect.any(String),
    uiChannel: expect.objectContaining({
        id: expect.any(String),
    }),
}

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

            // check parent canvas updated
            const updatedParentCanvas = await Services.loadCanvas(parentCanvas)
            expect(updatedParentCanvas).toMatchObject({
                ...parentCanvas,
                ...canvasMatcher,
                settings: expect.objectContaining({
                    childCanvasId: adhocCanvas.id, // captures child canvas id
                }),
            })
        })

        it('can unlink adhoc canvas', async () => {
            const parentCanvas = await Services.create()
            const adhocCanvas = await Services.createAdhocCanvas(parentCanvas)
            const updatedParentCanvas = await Services.unlinkParentCanvas(adhocCanvas)
            expect(updatedParentCanvas).toMatchObject({
                ...parentCanvas,
                ...canvasMatcher,
                id: parentCanvas.id, // should have loaded parent canvas
                settings: expect.not.objectContaining({
                    childCanvasId: expect.anything(), // child canvas id unset
                }),
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
            await Services.unlinkParentCanvas(adhocCanvas)
            const nextLoadedCanvas = await Services.loadRelevantCanvas(parentCanvas)
            expect(nextLoadedCanvas).toMatchObject({
                ...parentCanvas,
                ...canvasMatcher,
                id: parentCanvas.id, // should have loaded adhoc canvas
            })
        })
    })
})

