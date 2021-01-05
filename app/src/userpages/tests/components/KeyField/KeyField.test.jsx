import React from 'react'
import { mount } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

import KeyField from '$userpages/components/KeyField'
import Text from '$ui/Text'

describe('KeyField', () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('basic', () => {
        it('renders the component', () => {
            const el = mount(<KeyField
                keyName="myKey"
                value="testValue"
            />)

            assert(el.find('Label').text().replace(/\u200c/g, '') === 'myKey') // get rid of invisible &zwnj;
            assert(el.find(Text).prop('value') === 'testValue')
            assert(el.find(Text).prop('type') === 'text')
        })

        it('has a copy action', () => {
            const el = mount(<KeyField
                keyName="myKey"
                value="testValue"
            />)

            const actions = el.find('WithInputActions').prop('actions').map((action) => (
                mount(action)
            ))
            assert(actions.length === 1)
            assert(actions[0].find('Translate').text() === 'copy')
        })
    })

    describe('hide/reveal', () => {
        it('hides the value', () => {
            const el = mount(<KeyField
                keyName="myKey"
                value="testValue"
                hideValue
            />)

            assert(el.find(Text).prop('type') === 'password')
        })

        it('has a menu option to reveal the value', () => {
            const el = mount(<KeyField
                keyName="myKey"
                value="testValue"
                hideValue
            />)

            assert(el.find(Text).prop('type') === 'password')

            const action = mount(el.find('WithInputActions').prop('actions')[0])
            assert(action.find('Translate').text() === 'reveal')
        })
    })

    describe('editing', () => {
        it('has a menu option to edit value', () => {
            const el = mount(<KeyField
                keyName="myKey"
                value="testValue"
                allowEdit
            />)

            const action = mount(el.find('WithInputActions').prop('actions')[1])
            assert(action.find('Translate').text() === 'edit')
        })
    })

    describe('deleting', () => {
        it('has a menu option to remove value', () => {
            const el = mount(<KeyField
                keyName="myKey"
                value="testValue"
                allowDelete
            />)

            const action = mount(el.find('WithInputActions').prop('actions')[1])
            assert(action.find('Translate').text() === 'delete')
            assert(action.prop('disabled') !== true)
        })

        it('disables the delete option', () => {
            const el = mount(<KeyField
                keyName="myKey"
                value="testValue"
                allowDelete
                disableDelete
            />)

            const action = mount(el.find('WithInputActions').prop('actions')[1])
            assert(action.prop('disabled') === true)
        })
    })
})
