import * as State from '../state'
import * as Mocks from './mocks'

describe('Variadic Port Handling', () => {
    describe('add/connect modules', () => {
        it('creates an empty canvas', () => {
            let canvas = State.emptyCanvas()
            canvas = State.addModule(canvas, Mocks.Clock())
            canvas = State.addModule(canvas, Mocks.Table())
            const clock = canvas.modules.find((m) => m.name === 'Clock')
            const table = canvas.modules.find((m) => m.name === 'Table')
            expect(clock).toBeTruthy()
            expect(table).toBeTruthy()
            expect(clock.hash).not.toEqual(table.hash)
            const fromPort = State.findModulePort(canvas, clock.hash, (p) => p.name === 'timestamp')
            const toPort = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 1)
            expect(fromPort).toBeTruthy()
            expect(toPort).toBeTruthy()

            canvas = State.updateCanvas(State.connectPorts(canvas, fromPort.id, toPort.id))
            expect(State.isPortConnected(canvas, fromPort.id)).toBeTruthy()
            expect(State.isPortConnected(canvas, toPort.id)).toBeTruthy()

            const newVariadicInput = State.findModulePort(canvas, table.hash, (p) => p.variadic.index === 2)
            expect(newVariadicInput).toBeTruthy()
            expect(newVariadicInput.variadic.isLast).toBeTruthy()
        })
    })
})
