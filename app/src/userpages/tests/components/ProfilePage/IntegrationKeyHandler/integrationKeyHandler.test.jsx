import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'

import sinon from 'sinon'
import { IntegrationKeyHandler, mapStateToProps, mapDispatchToProps } from '../../../../components/ProfilePage/IntegrationKeyHandler'
import * as integrationKeyActions from '../../../../modules/integrationKey/actions'

describe('IntegrationKeyHandler', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('componentDidMount', () => {
        it('calls props.getIntegrationKeyByService', () => {
            const spy = sinon.spy()
            shallow(<IntegrationKeyHandler
                deleteIntegrationKey={() => {}}
                createIntegrationKey={() => {}}
                getIntegrationKeysByService={spy}
            />)
            assert(spy.calledOnce)
            assert(spy.calledWith('ETHEREUM'))
        })
    })

    describe('onNew', () => {
        it('must call props.createIntegrationKey', () => {
            const spy = sinon.spy()
            const el = shallow(<IntegrationKeyHandler
                deleteIntegrationKey={() => {}}
                createIntegrationKey={spy}
                getIntegrationKeysByService={() => {}}
            />)
            el.instance().onNew('name')
            assert(spy.calledWith({
                name: 'name',
                service: 'ETHEREUM',
                json: {},
            }))
        })
    })

    describe('onDelete', () => {
        it('must call props.deleteIntegrationKey', () => {
            const spy = sinon.spy()
            const el = shallow(<IntegrationKeyHandler
                deleteIntegrationKey={spy}
                createIntegrationKey={() => {}}
                getIntegrationKeysByService={() => {}}
            />)
            el.instance().onDelete('testId')
            assert(spy.calledOnce)
            assert(spy.calledWith('testId'))
        })
    })

    describe('render', () => {
        it('should render correctly', () => {
            const handler = shallow(<IntegrationKeyHandler
                deleteIntegrationKey={() => {}}
                createIntegrationKey={() => {}}
                getIntegrationKeysByService={() => {}}
            />)
            const handlerSegment = handler.find('IntegrationKeyHandlerSegment')
            assert(handlerSegment.exists())
            assert.equal(handlerSegment.props().service, 'ETHEREUM')
            assert.equal(handlerSegment.props().onNew, handler.instance().onNew)
            assert.equal(handlerSegment.props().onDelete, handler.instance().onDelete)
        })
    })

    describe('mapStateToProps', () => {
        it('must return right kind of object', () => {
            assert.deepStrictEqual(mapStateToProps({
                integrationKey: {
                    listsByService: {
                        ETHEREUM: [1, 2, 3],
                    },
                    error: 'testError',
                },
            }), {
                integrationKeys: [1, 2, 3],
                error: 'testError',
            })
        })
        it('must use empty array as integrationKeys in found none', () => {
            assert.deepStrictEqual(mapStateToProps({
                integrationKey: {
                    listsByService: {},
                    error: 'testError',
                },
            }), {
                integrationKeys: [],
                error: 'testError',
            })
        })
    })

    describe('mapDispatchToProps', () => {
        it('must return right kind of object with right type of attrs', () => {
            assert.equal(typeof mapDispatchToProps(), 'object')
            assert.equal(typeof mapDispatchToProps().deleteIntegrationKey, 'function')
            assert.equal(typeof mapDispatchToProps().createIntegrationKey, 'function')
            assert.equal(typeof mapDispatchToProps().getIntegrationKeysByService, 'function')
        })

        describe('deleteIntegrationKey', () => {
            it('must dispatch deleteIntegrationKey', () => {
                const dispatchSpy = sinon.spy()
                const deleteStub = sandbox.stub(integrationKeyActions, 'deleteIntegrationKey')
                    .callsFake((id) => id)
                mapDispatchToProps(dispatchSpy).deleteIntegrationKey('test')
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
                assert(dispatchSpy.calledWith('test'))
            })
        })

        describe('createIntegrationKey', () => {
            it('must dispatch createIntegrationKey', () => {
                const dispatchSpy = sinon.spy()
                const deleteStub = sandbox.stub(integrationKeyActions, 'createIntegrationKey')
                    .callsFake((key) => key)
                mapDispatchToProps(dispatchSpy).createIntegrationKey('test')
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
                assert(dispatchSpy.calledWith('test'))
            })
        })

        describe('getIntegrationKeysByService', () => {
            it('must dispatch getIntegrationKeysByService', () => {
                const dispatchSpy = sinon.spy()
                const deleteStub = sandbox.stub(integrationKeyActions, 'getIntegrationKeysByService')
                    .callsFake((service) => service)
                mapDispatchToProps(dispatchSpy).getIntegrationKeysByService('test')
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
                assert(dispatchSpy.calledWith('test'))
            })
        })
    })
})
