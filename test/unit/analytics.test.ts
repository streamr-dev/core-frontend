import { Analytics } from '../../src/analytics'

describe('analytics', () => {
    let analytics
    beforeEach(() => {
        analytics = new Analytics()
    })
    afterEach(() => {
        analytics = undefined
    })
    it('throws an error if id is not defined', () => {
        expect(() => analytics.register({})).toThrowError(/no id/)
    })
    it('throws an error if there is a duplicate service', () => {
        expect(() => {
            analytics.register({
                id: 'test',
            })
            analytics.register({
                id: 'test',
            })
        }).toThrowError(/already exists/)
    })
    it('calls init after register', () => {
        const initSpy1 = jest.fn()
        const initSpy2 = jest.fn()
        analytics.register({
            id: 'test1',
            init: initSpy1,
        })
        analytics.register({
            id: 'test2',
            init: initSpy2,
        })
        expect(initSpy1).toHaveBeenCalledTimes(1)
        expect(initSpy2).toHaveBeenCalledTimes(1)
    })
    it('calls reportError', () => {
        const reportSpy1 = jest.fn()
        const reportSpy2 = jest.fn()
        analytics.register({
            id: 'test1',
            reportError: reportSpy1,
        })
        analytics.register({
            id: 'test2',
            reportError: reportSpy2,
        })
        const error = new Error('some error')
        const extra = {
            info: 'something went wrong',
            userId: 1,
        }
        analytics.reportError(error, extra)
        expect(reportSpy1).toHaveBeenCalledTimes(1)
        expect(reportSpy1).toHaveBeenCalledWith(error, extra)
        expect(reportSpy2).toHaveBeenCalledTimes(1)
        expect(reportSpy2).toHaveBeenCalledWith(error, extra)
    })
    it('gets middleware', () => {
        const middlewareStub1 = jest.fn(() => 'md1')
        const middlewareStub2 = jest.fn(() => 'md2')
        analytics.register({
            id: 'test1',
            getMiddleware: middlewareStub1,
        })
        analytics.register({
            id: 'test2',
            getMiddleware: middlewareStub2,
        })
        expect(analytics.getMiddlewares()).toEqual(['md1', 'md2'])
    })
})
