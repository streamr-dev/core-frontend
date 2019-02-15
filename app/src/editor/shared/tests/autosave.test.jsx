import Autosave from '../utils/autosave'

function delay(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('autosave', () => {
    it('runs saveFn after waiting', async () => {
        const saveFn = jest.fn().mockImplementation(async (input) => input)
        const wait = 1000
        const autosave = Autosave(saveFn, wait)

        const value = { value: true }
        const startedAt = Date.now()
        expect(await autosave(value)).toBe(value)
        // at least wait ms elapsed
        expect(Date.now() - startedAt).toBeGreaterThan(wait)
        expect(saveFn).toHaveBeenCalledTimes(1)
    })

    it('runs saveFn at most once after waiting', async () => {
        const saveFn = jest.fn().mockImplementation(async (input) => input)
        const wait = 100
        const autosave = Autosave(saveFn, wait)

        const value1 = { value: 1 }
        const value2 = { value: 2 }

        expect(autosave.pending).toBeFalsy()

        const task1 = autosave(value1)
        expect(autosave.pending).toBeTruthy()
        await delay(50)
        expect(autosave.pending).toBeTruthy()
        const task2 = autosave(value2)
        expect(autosave.pending).toBeTruthy()

        expect(await task1).toBe(value2)
        expect(await task2).toBe(value2)
        expect(autosave.pending).toBeFalsy()

        expect(saveFn).toHaveBeenCalledTimes(1)
    })

    it('can cancel pending', async () => {
        const saveFn = jest.fn().mockImplementation(async (input) => input)
        const wait = 500
        const autosave = Autosave(saveFn, wait)

        const value = { value: 1 }

        const task = autosave(value)
        expect(autosave.pending).toBeTruthy()
        const cancelTask = autosave.cancel()
        expect(autosave.pending).toBeFalsy()
        expect(await task).toBe(false)
        expect(await cancelTask).toBeFalsy()

        expect(saveFn).not.toHaveBeenCalled()
    })
})
