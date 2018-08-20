import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import assert from 'assert-diff'
import NotificationSystem from 'react-notification-system'

import { Notifications, mapStateToProps, mapDispatchToProps } from '../../../../src/containers/Notifications'
import * as notificationActions from '../../../../src/modules/notifications/actions'

import BasicNotification from '../../../../src/components/Notifications/Basic'
import TransactionNotification from '../../../../src/containers/Notifications/Transaction'

describe('Notifications', () => {
    let wrapper
    let props
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        props = {
            notifications: [],
            isModalOpen: false,
        }
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('renders the component', () => {
        wrapper = shallow(<Notifications {...props} />)
        expect(wrapper.find(NotificationSystem).length).toEqual(1)
    })

    it('maps state to props', () => {
        const notifications = [
            {
                id: 1,
                created: 1,
                title: 'Test',
            },
        ]

        const state = {
            notifications: {
                notifications,
            },
            modals: {
                modalName: 'TEST_MODAL',
            },
        }

        const expectedProps = {
            notifications,
            isModalOpen: true,
        }

        assert.deepStrictEqual(mapStateToProps(state), expectedProps)
    })

    it('maps actions to props', () => {
        const hideNotificationStub = sandbox
            .stub(notificationActions, 'hideNotification')
            .callsFake(() => 'hideNotification')

        const dispatchStub = sandbox.stub().callsFake((action) => action)
        const actions = mapDispatchToProps(dispatchStub)

        actions.hideNotification(1)

        expect(dispatchStub.callCount).toEqual(1)
        expect(hideNotificationStub.callCount).toEqual(1)
    })

    it('shows a notification', () => {
        wrapper = mount(<Notifications {...props} />)

        const { notificationSystem } = wrapper.instance()
        const addNotificationStub = sandbox
            .stub(notificationSystem, 'addNotification')
            .callsFake(() => 'addNotification')

        // Add a notification
        wrapper.setProps({
            ...props,
            notifications: [
                {
                    id: 1,
                    created: 1,
                    title: 'Test 1',
                },
            ],
        })

        expect(addNotificationStub.callCount).toEqual(1)
    })

    it('hides a notification', () => {
        wrapper = mount(<Notifications {...props} />)

        const { notificationSystem } = wrapper.instance()
        const removeNotificationStub = sandbox
            .stub(notificationSystem, 'removeNotification')
            .callsFake(() => 'removeNotification')

        // Add couple of notifications
        wrapper.setProps({
            ...props,
            notifications: [
                {
                    id: 1,
                    created: 1,
                    title: 'Test 1',
                },
                {
                    id: 2,
                    created: 2,
                    title: 'Test 2',
                },
            ],
        })

        // Hide one
        wrapper.setProps({
            ...props,
            notifications: [
                {
                    id: 2,
                    created: 2,
                    title: 'Test 2',
                },
            ],
        })

        expect(removeNotificationStub.callCount).toEqual(1)
    })

    it('returns right notification component', () => {
        wrapper = shallow(<Notifications {...props} />)

        const normal = {
            id: 1,
            created: 1,
            title: 'Test 1',
        }
        const normalComponent = wrapper.instance().getComponentForNotification(normal)
        expect(normalComponent).toEqual(<BasicNotification title="Test 1" />)

        const tx = {
            id: 2,
            created: 2,
            title: 'Test 2',
            txHash: '0x123',
        }
        const txComponent = wrapper.instance().getComponentForNotification(tx)
        expect(txComponent).toEqual(<TransactionNotification txHash="0x123" />)
    })

    it('renders a notification', () => {
        wrapper = mount(<Notifications {...props} />)

        const notifications = [
            {
                id: 1,
                created: 1,
                title: 'Test 1',
            },
        ]
        wrapper.setProps({
            notifications,
        })
        expect(wrapper.find(BasicNotification).length).toEqual(1)
    })
})
