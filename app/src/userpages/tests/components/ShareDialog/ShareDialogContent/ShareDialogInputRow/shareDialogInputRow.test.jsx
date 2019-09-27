import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

import { ShareDialogInputRow } from '$userpages/components/ShareDialog/ShareDialogContent/ShareDialogInputRow'

describe('ShareDialogInputRow', () => {
    describe('onAdd', () => {
        it('should call props.onAdd', () => {
            const spy = sinon.spy()
            const inputRow = shallow(<ShareDialogInputRow
                resourceType=""
                resourceId=""
                onAdd={spy}
            />)
            inputRow.instance().onAdd()
            assert(spy.calledOnce)
        })
    })

    describe('render', () => {
        it('renders input correctly', () => {
            const inputRow = shallow(<ShareDialogInputRow
                resourceType=""
                resourceId=""
                addPermission={() => {}}
            />)
            const input = inputRow.find('input')
            assert.equal(input.props().placeholder, 'enterEmailAddress')
            assert.equal(input.props().name, 'email')
        })
    })
})
