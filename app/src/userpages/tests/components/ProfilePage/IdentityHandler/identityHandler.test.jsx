import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'
import * as actions from '$shared/modules/integrationKey/actions'
import { IdentityHandler, mapStateToProps, mapDispatchToProps } from '../../../../components/ProfilePage/IdentityHandler'
import { integrationKeyServices } from '$shared/utils/constants'

describe('IdentityHandler', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('componentDidMount', () => {
        it('calls props.getIntegrationKeys', () => {
            const spy = sandbox.spy()
            shallow(<IdentityHandler
                getIntegrationKeys={spy}
            />)
            assert(spy.calledOnce)
        })
    })
    describe('onNew', () => {
        it('must call props.createIdentity', () => {
            const spy = sandbox.spy()
            const el = shallow(<IdentityHandler
                createIdentity={spy}
                getIntegrationKeys={() => {}}
            />)
            el.instance().onNew('name')
            assert(spy.calledWith('name'))
        })
    })
    describe('onDelete', () => {
        it('must call props.deleteIntegrationKey', () => {
            const spy = sandbox.spy()
            const el = shallow(<IdentityHandler
                deleteIntegrationKey={spy}
                getIntegrationKeys={() => {}}
            />)
            el.instance().onDelete('testId')
            assert(spy.calledOnce)
            assert(spy.calledWith('testId'))
        })
    })
    describe('render', () => {
        it('should render correctly', () => {
            const handler = shallow(<IdentityHandler
                deleteIntegrationKey={() => {}}
                getIntegrationKeys={() => {}}
            />)
            const handlerSegment = handler.find('IntegrationKeyList')
            assert(handlerSegment.exists())
            assert.equal(handlerSegment.props().onDelete, handler.instance().onDelete)
        })
    })
    describe('mapStateToProps', () => {
        it('must return right kind of object', () => {
            const a = {
                id: '1',
                name: 'a',
                service: integrationKeyServices.ETHEREREUM_IDENTITY,
            }
            const b = {
                id: '2',
                name: 'b',
                service: integrationKeyServices.ETHEREREUM_IDENTITY,
            }
            const c = {
                id: '3',
                name: 'c',
                service: integrationKeyServices.ETHEREREUM_IDENTITY,
            }
            assert.deepStrictEqual(mapStateToProps({
                integrationKey: {
                    ethereumIdentities: [1, 2, 3],
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
                    ethereumIdentities: [],
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
            assert.equal(typeof mapDispatchToProps().createIdentity, 'function')
            assert.equal(typeof mapDispatchToProps().getIntegrationKeys, 'function')
        })
        describe('deleteIntegrationKey', () => {
            it('must dispatch deleteIntegrationKey', () => {
                const dispatchSpy = sandbox.spy()
                const deleteStub = sandbox.stub(actions, 'deleteIntegrationKey')
                    .callsFake((id) => id)
                mapDispatchToProps(dispatchSpy).deleteIntegrationKey('test')
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
                assert(dispatchSpy.calledWith('test'))
            })
        })
        describe('createIntegrationKey', () => {
            it('must dispatch createIdentity', () => {
                const dispatchSpy = sandbox.spy()
                const deleteStub = sandbox.stub(actions, 'createIdentity')
                    .callsFake((key) => key)
                mapDispatchToProps(dispatchSpy).createIdentity('test')
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
                assert(dispatchSpy.calledWith('test'))
            })
        })
        describe('getIntegrationKeys', () => {
            it('must dispatch getIntegrationKeys', () => {
                const dispatchSpy = sandbox.spy()
                const deleteStub = sandbox.stub(actions, 'fetchIntegrationKeys')
                    .callsFake((service) => service)
                mapDispatchToProps(dispatchSpy).getIntegrationKeys()
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
            })
        })
    })
})
