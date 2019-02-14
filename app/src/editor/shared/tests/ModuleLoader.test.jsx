import React from 'react'
import { mount } from 'enzyme'
import { ModuleLoader } from '../components/ModuleLoader'

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('ModuleLoader', () => {
    it('loads on active mount', async () => {
        const moduleResult = {
            moduleHash: 1,
        }

        const loadModule = jest.fn().mockResolvedValueOnce(moduleResult)
        const render = jest.fn().mockReturnValue(null)

        mount((
            <ModuleLoader isActive loadModule={loadModule}>
                {render}
            </ModuleLoader>
        ))

        expect(render).toHaveBeenCalled()

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: undefined,
        })

        await wait(100) // wait for load module to flush

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: moduleResult,
        })
    })

    it('forwards module, does not load if inactive', async () => {
        const originalModule = {
            isOriginal: true,
            moduleHash: 1,
        }

        const loadModule = jest.fn()
        const render = jest.fn().mockReturnValue(null)

        mount((
            <ModuleLoader isActive={false} module={originalModule} loadModule={loadModule}>
                {render}
            </ModuleLoader>
        ))

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: originalModule,
        })

        expect(loadModule).not.toHaveBeenCalled()
    })

    it('loads on active, unloads on not active', async () => {
        const originalModule = {
            isOriginal: true,
            moduleHash: 1,
        }

        const moduleResult = {
            isOriginal: false,
            moduleHash: 1,
        }

        const loadModule = jest.fn().mockResolvedValueOnce(moduleResult)
        const render = jest.fn().mockReturnValue(null)

        const wrapper = mount((
            <ModuleLoader isActive={false} module={originalModule} loadModule={loadModule}>
                {render}
            </ModuleLoader>
        ))

        expect(loadModule).not.toHaveBeenCalled()

        expect(render.mock.calls[0][0]).toMatchObject({
            module: originalModule, // forwards original
        })

        wrapper.setProps({ isActive: true })
        expect(loadModule).toHaveBeenCalledTimes(1)

        await wait(100) // wait for load module to flush

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: moduleResult, // should have loaded new module
        })

        wrapper.setProps({ isActive: false })

        expect(loadModule).toHaveBeenCalledTimes(1) // didn't call load again

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: originalModule, // module is now original module
        })
    })
})
