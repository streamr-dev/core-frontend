import assert from 'assert-diff'
import sinon from 'sinon'

import { Analytics } from '$shared/../analytics'

describe('analytics', () => {
    let analytics
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        analytics = new Analytics()
    })

    afterEach(() => {
        analytics = null
        sandbox.reset()
        sandbox.restore()
    })

    it('throws an error if id is not defined', () => {
        try {
            analytics.register({})
        } catch (e) {
            assert(/no id/.test(e.message))
        }
    })

    it('throws an error if there is a duplicate service', () => {
        try {
            analytics.register({
                id: 'test',
            })
            analytics.register({
                id: 'test',
            })
        } catch (e) {
            assert(/already exists/.test(e.message))
        }
    })

    it('calls init after register', () => {
        const initSpy1 = sandbox.spy()
        const initSpy2 = sandbox.spy()

        analytics.register({
            id: 'test1',
            init: initSpy1,
        })
        analytics.register({
            id: 'test2',
            init: initSpy2,
        })

        assert(initSpy1.calledOnce)
        assert(initSpy2.calledOnce)
    })

    it('calls reportError', () => {
        const reportSpy1 = sandbox.spy()
        const reportSpy2 = sandbox.spy()

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

        assert(reportSpy1.calledOnce)
        assert(reportSpy1.calledWith(error, extra))
        assert(reportSpy2.calledOnce)
        assert(reportSpy2.calledWith(error, extra))
    })

    it('gets middleware', () => {
        const middlewareStub1 = sinon.stub().callsFake(() => 'md1')
        const middlewareStub2 = sinon.stub().callsFake(() => 'md2')

        analytics.register({
            id: 'test1',
            getMiddleware: middlewareStub1,
        })
        analytics.register({
            id: 'test2',
            getMiddleware: middlewareStub2,
        })

        assert.deepEqual(analytics.getMiddlewares(), ['md1', 'md2'])
    })
})
