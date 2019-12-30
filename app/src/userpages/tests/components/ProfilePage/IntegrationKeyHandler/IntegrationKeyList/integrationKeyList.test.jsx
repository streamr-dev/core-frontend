import React from 'react'
import { shallow } from 'enzyme'

import IntegrationKeyList from '$userpages/components/ProfilePage/IntegrationKeyHandler/IntegrationKeyList'

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
            const el = shallow(<IntegrationKeyList
                integrationKeys={keys}
                onDelete={onDelete}
                onEdit={onEdit}
                hideValues
                truncateValues
                className="extra"
            />)
            const keyFields = el.find('KeyField')
            expect(keyFields.length).toBe(3)
        })
    })
})
