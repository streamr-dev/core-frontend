import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'

import IntegrationKeyHandlerSegment from '../../../../../components/ProfilePage/IntegrationKeyHandler/IntegrationKeyHandlerSegment'

describe('IntegrationKeyHandler', () => {
    describe('render', () => {
        it('renders IntegrationKeyList correctly', () => {
            const onDelete = () => {}
            const el = shallow(<IntegrationKeyHandlerSegment
                integrationKeys={[3, 2, 1]}
                service=""
                name="test"
                getIntegrationKeys={() => {}}
                createIntegrationKey=""
                deleteIntegrationKey=""
                onDelete={onDelete}
                hideValues
            />)
            const table = el.find('IntegrationKeyList')
            assert.deepStrictEqual(table.props(), {
                integrationKeys: [3, 2, 1],
                onDelete,
                hideValues: true,
            })
        })
        it('renders AddKeyField correctly', () => {
            const onNew = () => {}
            const el = shallow(<IntegrationKeyHandlerSegment
                integrationKeys={[3, 2, 1]}
                service=""
                name="test"
                getIntegrationKeys={() => {}}
                createIntegrationKey=""
                deleteIntegrationKey=""
                onNew={onNew}
                createWithValue
            />)
            const input = el.find('AddKeyField')

            assert.deepStrictEqual(input.props(), {
                label: 'addNewAddress',
                onSave: onNew,
                createWithValue: true,
            })
        })
        it('does not render AddKeyField if props.showInput === false', () => {
            const onNew = () => {}
            const el = shallow(<IntegrationKeyHandlerSegment
                tableFields={[]}
                inputFields={[1, 2, 3]}
                integrationKeys={[3, 2, 1]}
                service=""
                name="test"
                getIntegrationKeys={() => {}}
                createIntegrationKey=""
                deleteIntegrationKey=""
                onNew={onNew}
                showInput={false}
            />)
            assert.equal(el.find('AddKeyField').length, 0)
        })
    })
})
