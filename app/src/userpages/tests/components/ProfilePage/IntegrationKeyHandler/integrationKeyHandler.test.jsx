import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'

import sinon from 'sinon'
import { IntegrationKeyHandler, mapStateToProps, mapDispatchToProps } from '$userpages/components/ProfilePage/IntegrationKeyHandler'
import * as integrationKeyActions from '$shared/modules/integrationKey/actions'
import { integrationKeyServices } from '$shared/utils/constants'

describe('IntegrationKeyHandler', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('componentDidMount', () => {
        it('calls props.getIntegrationKeys', () => {
            const spy = sinon.spy()
            shallow(<IntegrationKeyHandler
                deleteIntegrationKey={() => {}}
                createIntegrationKey={() => {}}
                getIntegrationKeys={spy}
            />)
            assert(spy.calledOnce)
        })
    })

    describe('onNew', () => {
        it('must call props.createIntegrationKey', () => {
            const spy = sinon.spy()
            const el = shallow(<IntegrationKeyHandler
                deleteIntegrationKey={() => {}}
                createIntegrationKey={spy}
                getIntegrationKeys={() => {}}
            />)
            el.instance().onNew('name')
            assert(spy.calledWith('name'))
        })
    })

    describe('onDelete', () => {
        it('must call props.deleteIntegrationKey', () => {
            const spy = sinon.spy()
            const el = shallow(<IntegrationKeyHandler
                deleteIntegrationKey={spy}
                createIntegrationKey={() => {}}
                getIntegrationKeys={() => {}}
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
                getIntegrationKeys={() => {}}
            />)
            const handlerSegment = handler.find('IntegrationKeyList')
            assert(handlerSegment.exists())
            assert.equal(handlerSegment.props().onNew, handler.instance().onNew)
            assert.equal(handlerSegment.props().onDelete, handler.instance().onDelete)
        })
    })

    describe('mapStateToProps', () => {
        it('must return right kind of object', () => {
            const a = {
                id: '1',
                name: 'a',
                service: integrationKeyServices.PRIVATE_KEY,
            }
            const b = {
                id: '2',
                name: 'b',
                service: integrationKeyServices.PRIVATE_KEY,
            }
            const c = {
                id: '3',
                name: 'c',
                service: integrationKeyServices.PRIVATE_KEY,
            }
            assert.deepStrictEqual(mapStateToProps({
                integrationKey: {
                    privateKeys: [1, 2, 3],
                    integrationKeysError: 'testError',
                },
                entities: {
                    integrationKeys: {
                        '1': { ...a },
                        '2': { ...b },
                        '3': { ...c },
                    },
                },
            }), {
                integrationKeys: [a, b, c],
                error: 'testError',
            })
        })
        it('must use empty array as integrationKeys in found none', () => {
            assert.deepStrictEqual(mapStateToProps({
                integrationKey: {
                    privateKeys: [],
                    integrationKeysError: 'testError',
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
            assert.equal(typeof mapDispatchToProps().getIntegrationKeys, 'function')
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

        describe('getIntegrationKeys', () => {
            it('must dispatch getIntegrationKeys', () => {
                const dispatchSpy = sinon.spy()
                const deleteStub = sandbox.stub(integrationKeyActions, 'fetchIntegrationKeys')
                    .callsFake((service) => service)
                mapDispatchToProps(dispatchSpy).getIntegrationKeys()
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
            })
        })
    })
})
