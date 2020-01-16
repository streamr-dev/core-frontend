import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'
import { act } from 'react-dom/test-utils'

import KeyField from '$userpages/components/KeyField'
import TextInput from '$shared/components/TextInput'
import DropdownActions from '$shared/components/DropdownActions'
import KeyFieldEditor from '$userpages/components/KeyField/KeyFieldEditor'

describe('KeyField', () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('basic', () => {
        it('renders the component', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
            />)

            assert(el.find(TextInput).prop('label') === 'myKey')
            assert(el.find(TextInput).prop('value') === 'testValue')
            assert(el.find(TextInput).prop('type') === 'text')
        })

        it('has a copy action', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
            />)

            const actions = el.find(TextInput).prop('actions').map((action) => (
                shallow(action)
            ))
            assert(actions.length === 1)
            assert(actions[0].find('Translate').shallow().text() === 'copy')
        })
    })

    describe('hide/reveal', () => {
        it('hides the value', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                hideValue
            />)

            assert(el.find(TextInput).prop('type') === 'password')
        })

        it('has a menu option to reveal the value', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                hideValue
            />)

            assert(el.find(TextInput).prop('type') === 'password')

            const action = shallow(el.find(TextInput).prop('actions')[0])
            assert(action.find('Translate').shallow().text() === 'reveal')
        })
    })

    describe('editing', () => {
        it('has a menu option to edit value', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                allowEdit
            />)

            const action = shallow(el.find(TextInput).prop('actions')[1])
            assert(action.find('Translate').shallow().text() === 'edit')
        })
    })

    describe('deleting', () => {
        it('has a menu option to remove value', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                allowDelete
            />)

            const action = shallow(el.find(TextInput).prop('actions')[1])
            assert(action.find('Translate').shallow().text() === 'delete')
            assert(action.prop('disabled') !== true)
        })

        it('disables the delete option', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                allowDelete
                disableDelete
            />)

            const action = shallow(el.find(TextInput).prop('actions')[1])
            assert(action.prop('disabled') === true)
        })
    })
})
