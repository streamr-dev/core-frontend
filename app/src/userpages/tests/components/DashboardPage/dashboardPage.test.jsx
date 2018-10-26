import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'
import uuid from 'uuid'
import { DashboardPage, mapStateToProps, mapDispatchToProps } from '../../../components/DashboardPage/EditorPage'
import * as dashboardActions from '../../../modules/dashboard/actions'
import * as canvasActions from '../../../modules/canvas/actions'

describe('DashboardPage', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('componentWillMount', () => {
        it('must always getCanvases', () => {
            const id = 'test'
            const getCanvasesSpy = sandbox.spy()
            shallow(<DashboardPage
                match={{
                    params: {
                        id,
                    },
                }}
                getCanvases={getCanvasesSpy}
                getDashboard={() => {}}
                getMyDashboardPermissions={() => {}}
                openDashboard={() => {}}
            />)
            assert(getCanvasesSpy.calledOnce)
            shallow(<DashboardPage
                match={{
                    params: {},
                }}
                getCanvases={getCanvasesSpy}
                openDashboard={() => {}}
                newDashboard={() => {}}
            />)
            assert(getCanvasesSpy.calledTwice)
        })
        it('must getDashboard and its permissions and open dashboard if id is given', () => {
            const id = 'test'
            const getDashboardSpy = sandbox.spy()
            const getMyDashboardPermissionsSpy = sandbox.spy()
            const openDashboardSpy = sandbox.spy()
            shallow(<DashboardPage
                match={{
                    params: {
                        id,
                    },
                }}
                getDashboard={getDashboardSpy}
                getMyDashboardPermissions={getMyDashboardPermissionsSpy}
                openDashboard={openDashboardSpy}
                getCanvases={() => {}}
            />)
            assert(getDashboardSpy.calledOnce)
            assert(getDashboardSpy.calledWith(id))
            assert(getMyDashboardPermissionsSpy.calledOnce)
            assert(getMyDashboardPermissionsSpy.calledWith(id))
            assert(openDashboardSpy.calledOnce)
            assert(openDashboardSpy.calledWith(id))
        })
        it('must generate id, create newDashboard and openDashboard if id is not given', () => {
            const id = 'test'
            const newDashboardSpy = sandbox.spy()
            const openDashboardSpy = sandbox.spy()
            const uuidStub = sandbox.stub(uuid, 'v4').callsFake(() => id)
            shallow(<DashboardPage
                match={{
                    params: {},
                }}
                newDashboard={newDashboardSpy}
                openDashboard={openDashboardSpy}
                getCanvases={() => {}}
            />)
            assert(uuidStub.calledOnce)
            assert(newDashboardSpy.calledOnce)
            assert(newDashboardSpy.calledWith(id))
            assert(openDashboardSpy.calledOnce)
            assert(openDashboardSpy.calledWith(id))
        })
    })

    describe('mapStateToProps', () => {
        it('must return the correct dashboard', () => {
            const dashboard = {
                a: 1,
            }
            assert.deepStrictEqual(mapStateToProps({
                dashboard: {
                    ids: [1],
                    openDashboard: {
                        id: 1,
                    },
                },
                entities: {
                    dashboards: {
                        '1': dashboard,
                    },
                },
            }), {
                dashboard,
            })
        })
    })

    describe('mapDispatchToProps', () => {
        it('must dispatch getDashboard when called getDashboard', () => {
            const dispatchSpy = sandbox.spy()
            const stub = sandbox.stub(dashboardActions, 'getDashboard').callsFake(() => 'test')
            mapDispatchToProps(dispatchSpy).getDashboard('id')
            assert(stub.calledOnce)
            assert(stub.calledWith('id'))
            assert(dispatchSpy.calledOnce)
            assert(dispatchSpy.calledWith('test'))
        })
        it('must dispatch getMyDashboardPermissions when called getMyDashboardPermissions', () => {
            const dispatchSpy = sandbox.spy()
            const stub = sandbox.stub(dashboardActions, 'getMyDashboardPermissions').callsFake(() => 'test')
            mapDispatchToProps(dispatchSpy).getMyDashboardPermissions('id')
            assert(stub.calledOnce)
            assert(stub.calledWith('id'))
            assert(dispatchSpy.calledOnce)
            assert(dispatchSpy.calledWith('test'))
        })
        it('must dispatch newDashboard when called newDashboard', () => {
            const dispatchSpy = sandbox.spy()
            const stub = sandbox.stub(dashboardActions, 'newDashboard').callsFake(() => 'test')
            mapDispatchToProps(dispatchSpy).newDashboard('id')
            assert(stub.calledOnce)
            assert(stub.calledWith('id'))
            assert(dispatchSpy.calledOnce)
            assert(dispatchSpy.calledWith('test'))
        })
        it('must dispatch getCanvases when called getCanvases', () => {
            const dispatchSpy = sandbox.spy()
            const stub = sandbox.stub(canvasActions, 'getCanvases').callsFake(() => 'test')
            mapDispatchToProps(dispatchSpy).getCanvases()
            assert(stub.calledOnce)
            assert(dispatchSpy.calledOnce)
            assert(dispatchSpy.calledWith('test'))
        })
        it('must dispatch openDashboard when called openDashboard', () => {
            const dispatchSpy = sandbox.spy()
            const stub = sandbox.stub(dashboardActions, 'openDashboard').callsFake(() => 'test')
            mapDispatchToProps(dispatchSpy).openDashboard('id')
            assert(stub.calledOnce)
            assert(stub.calledWith('id'))
            assert(dispatchSpy.calledOnce)
            assert(dispatchSpy.calledWith('test'))
        })
    })
})
