import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

import * as permissionActions from '$userpages/modules/permission/actions'

import {
    ShareDialogPermission,
    mapDispatchToProps,
} from '$userpages/components/ShareDialog/ShareDialogContent/ShareDialogPermissionRow/ShareDialogPermission'

describe('ShareDialogPermission', () => {
    describe('onSelect', () => {
        it('should call props.setResourceHighestOperation with the given value', () => {
            const spy = sinon.spy()
            const component = shallow(<ShareDialogPermission
                resourceType=""
                resourceId=""
                permissions={[]}
                remove={() => {}}
                setResourceHighestOperation={spy}
            />)
            component.instance().onSelect({
                value: 'test',
            })
            assert(spy.calledOnce)
            assert(spy.calledWith('test'))
        })
    })

    describe('onRemove', () => {
        it('should call props.setResourceHighestOperation with the given value', () => {
            const spy = sinon.spy()
            const component = shallow(<ShareDialogPermission
                resourceType=""
                resourceId=""
                permissions={[]}
                remove={spy}
                setResourceHighestOperation={() => {}}
            />)
            component.instance().onRemove()
            assert(spy.calledOnce)
        })
    })

    describe('render', () => {
        it('does not render the userLabel for the current user', () => {
            const permissions = [{
                user: 'test@test.test',
            }]
            const permissionRow = shallow(<ShareDialogPermission
                username="test@test.test"
                permissions={permissions}
                resourceType=""
                resourceId=""
            />)

            expect(permissionRow.find('.user')).toHaveLength(0)
        })

        it('renders the userLabel for other users', () => {
            const permissions = [{
                user: 'test2@test.test',
            }]
            const permissionRow = shallow(<ShareDialogPermission
                username="test@test.test"
                permissions={permissions}
                resourceType=""
                resourceId=""
            />)

            expect(permissionRow.find('.user')).toHaveLength(1)
            expect(permissionRow.find('.user').find('.userId').text()).toEqual('test2@test.test')
        })

        it('renders the userLabel correctly if there is no user', () => {
            const permissions = [{
                user: 'A',
            }]
            const permissionRow = shallow(<ShareDialogPermission
                permissions={permissions}
                resourceType=""
                resourceId=""
            />)

            assert(permissionRow.find('.user'))
            assert.equal(permissionRow.find('.user').find('.userId').text(), 'A')
        })
    })

    describe('mapDispatchToProps', () => {
        it('should return an object with the right kind of props', () => {
            assert.deepStrictEqual(typeof mapDispatchToProps(), 'object')
            assert.deepStrictEqual(typeof mapDispatchToProps().setResourceHighestOperation, 'function')
            assert.deepStrictEqual(typeof mapDispatchToProps().remove, 'function')
        })
        describe('setResourceHighestOperation', () => {
            it('should dispatch setResourceHighestOperationForUser and call it with right attrs', () => {
                const dispatchSpy = sinon.spy()
                const addStub = sinon.stub(permissionActions, 'setResourceHighestOperationForUser')
                    .callsFake((type, id, user, value) => `${type}-${id}-${user}-${value}`)
                mapDispatchToProps(dispatchSpy, {
                    resourceType: 'myType',
                    resourceId: 'myId',
                    permissions: [{
                        user: 'a',
                    }],
                }).setResourceHighestOperation('test')
                assert(dispatchSpy.calledOnce)
                assert(dispatchSpy.calledWith('myType-myId-a-test'))
                assert(addStub.calledOnce)
            })
        })
        describe('removeAllResourcePermissionsByUser', () => {
            it('should dispatch setResourceHighestOperationForUser and call it with right attrs', () => {
                const dispatchSpy = sinon.spy()
                const addStub = sinon.stub(permissionActions, 'removeAllResourcePermissionsByUser')
                    .callsFake((type, id, user) => `${type}-${id}-${user}`)
                mapDispatchToProps(dispatchSpy, {
                    resourceType: 'myType',
                    resourceId: 'myId',
                    permissions: [{
                        user: 'a',
                    }],
                }).remove()
                assert(dispatchSpy.calledOnce)
                assert(dispatchSpy.calledWith('myType-myId-a'))
                assert(addStub.calledOnce)
            })
        })
    })
})
