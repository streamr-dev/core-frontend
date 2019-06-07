import { CancellableDebounce } from '../utils/autosave'

function delay(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

describe('CancellableDebounce', () => {
    it('can handle rejections', async () => {
        const rejection = new Error('expected rejection')
        const saveFn = jest.fn().mockRejectedValue(rejection)
        const wait = 100
        const debouncedFn = CancellableDebounce(saveFn, wait)

        const value = { value: true }
        await expect(debouncedFn(value)).rejects.toBe(rejection)
        expect(saveFn).toHaveBeenCalledTimes(1)
        expect(saveFn).toHaveBeenCalledWith(value)
    })

    it('runs saveFn after waiting', async () => {
        const saveFn = jest.fn().mockImplementation(async (input) => input)
        const wait = 1000
        const debouncedFn = CancellableDebounce(saveFn, wait)

        const value = { value: true }
        const startedAt = Date.now()
        expect(await debouncedFn(value)).toBe(value)
        // at least wait ms elapsed
        expect(Date.now() - startedAt).toBeGreaterThanOrEqual(wait)
        expect(saveFn).toHaveBeenCalledTimes(1)
        expect(saveFn).toHaveBeenCalledWith(value)
    })

    it('runs saveFn at most once after waiting', async () => {
        const saveFn = jest.fn().mockImplementation(async (input) => input)
        const wait = 100
        const debouncedFn = CancellableDebounce(saveFn, wait)

        const value1 = { value: 1 }
        const value2 = { value: 2 }

        expect(debouncedFn.pending).toBeFalsy()

        const task1 = debouncedFn(value1)
        expect(debouncedFn.pending).toBeTruthy()
        await delay(50)
        expect(debouncedFn.pending).toBeTruthy()
        const task2 = debouncedFn(value2)
        expect(debouncedFn.pending).toBeTruthy()

        expect(await task1).toBe(value2)
        expect(await task2).toBe(value2)
        expect(debouncedFn.pending).toBeFalsy()

        expect(saveFn).toHaveBeenCalledTimes(1)
        expect(saveFn).toHaveBeenCalledWith(value2)
    })

    it('can cancel pending', async () => {
        const saveFn = jest.fn().mockImplementation(async (input) => input)
        const wait = 500
        const debouncedFn = CancellableDebounce(saveFn, wait)

        const value = { value: 1 }

        const task = debouncedFn(value)
        expect(debouncedFn.pending).toBeTruthy()
        const cancelTask = debouncedFn.cancel()
        expect(debouncedFn.pending).toBeFalsy()
        expect(await task).toBe(false)
        expect(await cancelTask).toBeFalsy()

        expect(saveFn).not.toHaveBeenCalled()
    })
})
