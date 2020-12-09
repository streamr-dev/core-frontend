import React from 'react'
import { mount } from 'enzyme'

import IntegrationKeyList from '$userpages/components/ProfilePage/IntegrationKeyHandler/IntegrationKeyList'

jest.mock('$shared/hooks/useBalances')

const keys = [{
    id: 1,
}, {
    id: 2,
}, {
    id: 3,
}]

describe('IntegrationKeyHandler', () => {
    describe('render', () => {
        it('renders KeyFields correctly', () => {
            const onDelete = () => {}
            const onEdit = () => {}
            const el = mount(<IntegrationKeyList
                integrationKeys={keys}
                onDelete={onDelete}
                onEdit={onEdit}
                hideValues
                className="extra"
            />)
            const keyFields = el.find('KeyField')
            expect(keyFields.length).toBe(3)
        })
    })
})
