import { setupAuthorizationHeader, loadModuleDefinition } from '$editor/shared/tests/utils'

import * as State from '../state'
import { changedModules } from '../state/diff'
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
})
