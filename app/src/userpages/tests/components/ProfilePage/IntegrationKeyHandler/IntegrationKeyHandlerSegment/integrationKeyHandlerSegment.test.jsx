import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'

import IntegrationKeyHandlerSegment from '../../../../../components/ProfilePage/IntegrationKeyHandler/IntegrationKeyHandlerSegment'

describe('IntegrationKeyHandler', () => {
    describe('render', () => {
        it('renders IntegrationKeyList correctly', () => {
            const onDelete = () => {}
            const onEdit = () => {}
            const el = shallow(<IntegrationKeyHandlerSegment
                integrationKeys={[3, 2, 1]}
                service=""
                name="test"
                getIntegrationKeys={() => {}}
                createIntegrationKey=""
                deleteIntegrationKey=""
                onDelete={onDelete}
                onEdit={onEdit}
                hideValues
                truncateValues
            />)
            const table = el.find('IntegrationKeyList')
            const x = table.props()
            debugger
            assert.deepStrictEqual(x, {
                integrationKeys: [3, 2, 1],
                onDelete,
                onEdit,
                hideValues: true,
                truncateValues: true,
            })
        })
    })
})
