import React from 'react'
import ActivityList from '$shared/components/ActivityList'
import { mount } from 'enzyme'

jest.mock('$shared/contexts/StreamrClient', () => ({
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
}))

jest.mock('$shared/components/Subscription', () => ({
    __esModule: true,
    default: () => null,
}))

describe('ActivityList', () => {
    afterEach(() => {
        delete process.env.ACTIVITY_QUEUE
        global.localStorage.removeItem('user.activityStreamId')
    })

    it('does NOT render its children if ACTIVITY_QUEUE is falsy', () => {
        global.localStorage.setItem('user.activityStreamId', 'STREAM_ID')
        delete process.env.ACTIVITY_QUEUE

        const el = mount((
            <ActivityList>
                <div id="CHILD" />
            </ActivityList>
        ))

        expect(el.find('#CHILD').exists()).toBe(false)
    })

    it('does NOT render its children if stored id is blank', () => {
        global.localStorage.removeItem('user.activityStreamId')
        process.env.ACTIVITY_QUEUE = 1

        const el = mount((
            <ActivityList>
                <div id="CHILD" />
            </ActivityList>
        ))

        expect(el.find('#CHILD').exists()).toBe(false)
    })

    it('renders its children if both ACTIVITY_QUEUE env var and stream id are truthy', () => {
        global.localStorage.setItem('user.activityStreamId', 'STREAM_ID')
        process.env.ACTIVITY_QUEUE = 1

        const el = mount((
            <ActivityList>
                <div id="CHILD" />
            </ActivityList>
        ))

        expect(el.find('#CHILD').exists()).toBe(true)
    })
})
