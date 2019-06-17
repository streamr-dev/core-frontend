import React from 'react'
import { mount } from 'enzyme'
import { RunStateLoader } from '../components/RunStateLoader'

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('RunStateLoader', () => {
    it('loads on active mount', async () => {
        const moduleResult = {
            moduleHash: 1,
        }

        const loadRunState = jest.fn().mockResolvedValueOnce(moduleResult)
        const render = jest.fn().mockReturnValue(null)

        mount((
            <RunStateLoader isActive loadRunState={loadRunState}>
                {render}
            </RunStateLoader>
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

        const loadRunState = jest.fn()
        const render = jest.fn().mockReturnValue(null)

        mount((
            <RunStateLoader isActive={false} module={originalModule} loadRunState={loadRunState}>
                {render}
            </RunStateLoader>
        ))

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: originalModule,
        })

        expect(loadRunState).not.toHaveBeenCalled()
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

        const loadRunState = jest.fn().mockResolvedValueOnce(moduleResult)
        const render = jest.fn().mockReturnValue(null)

        const wrapper = mount((
            <RunStateLoader isActive={false} module={originalModule} loadRunState={loadRunState}>
                {render}
            </RunStateLoader>
        ))

        expect(loadRunState).not.toHaveBeenCalled()

        expect(render.mock.calls[0][0]).toMatchObject({
            module: originalModule, // forwards original
        })

        wrapper.setProps({ isActive: true })
        expect(loadRunState).toHaveBeenCalledTimes(1)

        await wait(100) // wait for load module to flush

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: moduleResult, // should have loaded new module
        })

        wrapper.setProps({ isActive: false })

        expect(loadRunState).toHaveBeenCalledTimes(1) // didn't call load again

        expect(render.mock.calls[render.mock.calls.length - 1][0]).toMatchObject({
            module: originalModule, // module is now original module
        })
    })
})
