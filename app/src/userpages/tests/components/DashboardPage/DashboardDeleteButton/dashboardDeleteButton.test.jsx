import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'
import * as parseState from '../../../../helpers/parseState'
import * as actions from '../../../../modules/dashboard/actions'
import links from '../../../../../links'

import { DashboardDeleteButton, mapStateToProps, mapDispatchToProps } from '../../../../components/DashboardPage/DashboardDeleteButton'

describe('DashboardDeleteButton', () => {
    let dashboardDeleteButton
    let dashboard
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        dashboard = {
            name: 'test',
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('onDelete', () => {
        it('must call props.deleteDashboard and set the window.location', (done) => {
            const history = {
                push: sandbox.spy(),
            }
            const mock = () => Promise.resolve().then(() => {
                setTimeout(() => {
                    assert(history.push.calledOnce)
                    assert(history.push.calledWith(links.userpages.dashboardList))
                    done()
                })
            })
            dashboardDeleteButton = shallow(<DashboardDeleteButton
                deleteDashboard={mock}
                dashboard={dashboard}
                history={history}
            />)
            dashboardDeleteButton.instance().onDelete()
        })
    })

    describe('render', () => {
        it('must render ConfirmButton with onDelete as props.confirmCallBack', () => {
            const deleteButton = shallow(<DashboardDeleteButton
                dashboard={dashboard}
            />)
            const confirmButton = deleteButton.find('ConfirmButton')
            assert.deepStrictEqual(confirmButton.props().confirmCallback, deleteButton.instance().onDelete)
        })
    })

    describe('mapStateToProps', () => {
        it('must return parseDashboard(state)', () => {
            const stub = sandbox.stub(parseState, 'parseDashboard').callsFake((state) => state.id)
            assert.equal(mapStateToProps({
                id: 'test',
            }), 'test')
            assert(stub.calledOnce)
        })
    })

    describe('mapDispatchToProps', () => {
        it('must dispatch deleteDashboard(id)', () => {
            const deleteDashboardStub = sandbox.stub(actions, 'deleteDashboard').callsFake((id) => id)
            const dispatchSpy = sandbox.spy()
            mapDispatchToProps(dispatchSpy).deleteDashboard('test')
            assert(deleteDashboardStub.calledOnce)
            assert(dispatchSpy.calledOnce)
            assert(dispatchSpy.calledWith('test'))
        })
    })
})
