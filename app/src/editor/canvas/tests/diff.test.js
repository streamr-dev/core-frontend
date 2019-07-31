import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import { changedModules, isEqualCanvas } from '../state/diff'
import * as Services from '../services'

import './utils'

describe('Canvas Diff', () => {
    let teardown

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await Services.deleteAllCanvases()
        await teardown()
    })
    describe('isEqualCanvas', () => {
        it('true for identical canvases', async () => {
            const canvas = State.emptyCanvas()
            expect(isEqualCanvas(canvas, canvas)).toBe(true)
            expect(isEqualCanvas(State.emptyCanvas(), State.emptyCanvas())).toBe(true)
        })

        it('false for changed canvas name', async () => {
            expect(isEqualCanvas(State.emptyCanvas({
                name: 'something',
            }), State.emptyCanvas())).toBe(false)
        })

        it('false for changed canvas modules', async () => {
            const canvasBefore = State.emptyCanvas()
            const canvasAfter = State.addModule(canvasBefore, await loadModuleDefinition('ConstantText'))

            expect(isEqualCanvas(canvasBefore, canvasAfter)).toBe(false)
        })

        it('true for saved canvas with different updated/created time', async () => {
            const savedCanvas1 = State.updateCanvas(await Services.create(State.emptyCanvas()))
            const savedCanvas2 = State.updateCanvas(await Services.saveNow(savedCanvas1))
            expect(isEqualCanvas(savedCanvas1, savedCanvas2)).toBe(true)
        })
    })

    describe('changedModules', () => {
        it('reports no change for identical canvases', async () => {
            const canvas = State.emptyCanvas()
            expect(changedModules(canvas, canvas)).toEqual([])
            expect(changedModules(State.emptyCanvas(), State.emptyCanvas())).toEqual([])
        })

        it('reports change for canvas with different modules', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            const [constantText] = canvas.modules
            expect(changedModules(canvas, State.emptyCanvas())).toEqual([constantText.hash])
            expect(changedModules(State.emptyCanvas(), canvas)).toEqual([constantText.hash])
        })

        it('reports change for canvas with different modules', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            const [constantText] = canvas.modules
            expect(changedModules(canvas, State.emptyCanvas())).toEqual([constantText.hash])
            expect(changedModules(State.emptyCanvas(), canvas)).toEqual([constantText.hash])
        })

        it('ignores change if modules just reordered', async () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, await loadModuleDefinition('ConstantText'))
            canvas = State.addModule(canvas, await loadModuleDefinition('Constant'))
            const canvas2 = {
                ...canvas,
                modules: canvas.modules.slice().reverse().map((m) => ({ ...m })),
            }
            expect(changedModules(canvas, canvas2)).toEqual([])
            expect(changedModules(canvas2, canvas)).toEqual([])
        })
    })

    it('ignores change in internals of subcanvas', async () => {
        let subcanvas = await Services.create()
        subcanvas = State.addModule(subcanvas, await loadModuleDefinition('Constant'))
        const [constant] = subcanvas.modules

        // export subcanvas output & save
        subcanvas = State.setPortOptions(subcanvas, constant.outputs[0].id, {
            export: true,
        })
        subcanvas = State.updateCanvas(await Services.saveNow(subcanvas))

        // create new canvas to add subcanvas into
        let canvas = await Services.create()
        canvas = State.addModule(canvas, await loadModuleDefinition('Canvas'))
        const [canvasModule] = canvas.modules

        // select subcanvas
        canvas = State.updatePort(canvas, canvasModule.params[0].id, (port) => ({
            ...port,
            value: subcanvas.id,
        }))

        canvas = State.updateCanvas(await Services.saveNow(State.updateCanvas(canvas)))
        // save state of canvas after original
        const canvasBefore = canvas

        // change some internals that shouldn't affect diff
        subcanvas = State.updateModulePosition(subcanvas, constant.hash, {
            top: Number.parseInt(constant.layout.position.top, 10) + 333,
            left: Number.parseInt(constant.layout.position.left, 10) + 333,
        })
        subcanvas = State.updateCanvas(await Services.saveNow(subcanvas))

        // reload canvas to get updated subcanvas
        canvas = State.updateCanvas(await Services.saveNow(canvas))
        const [canvasModuleUpdated] = canvas.modules
        // verify internals did change
        expect(canvasModuleUpdated.modules[0]).not.toEqual(canvasModule.modules[0])
        // but diff does not report change
        expect(changedModules(canvas, canvasBefore)).toEqual([])
        expect(isEqualCanvas(canvas, canvasBefore)).toBe(true)

        // check diff does report change if exported interface changes
        subcanvas = State.setPortOptions(subcanvas, constant.params[0].id, {
            export: true, // export another subscanvas property
        })

        subcanvas = State.updateCanvas(await Services.saveNow(subcanvas))
        // reload canvas to get updated subcanvas
        canvas = State.updateCanvas(await Services.saveNow(canvas))
        // canvas module should have changed
        expect(changedModules(canvas, canvasBefore)).toEqual([canvasModule.hash])
        expect(isEqualCanvas(canvas, canvasBefore)).toBe(true)
    })
})
