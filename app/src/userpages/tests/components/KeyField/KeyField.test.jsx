import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

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

            el.instance().toggleHidden()
            assert(el.find(TextInput).prop('type') === 'text')
        })

        it('has a menu option to hide the value again if revealed', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                hideValue
            />)
            assert(el.find(TextInput).prop('type') === 'password')

            const action = shallow(el.find(TextInput).prop('actions')[0])
            assert(action.find('Translate').shallow().text() === 'reveal')
            el.instance().toggleHidden()

            assert(el.find(TextInput).prop('type') === 'text')

            el.instance().toggleHidden()
            assert(el.find(TextInput).prop('type') === 'password')
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

        it('changes to editor', () => {
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                allowEdit
            />)

            el.instance().onEdit()

            assert(el.find(TextInput).length === 0)
            assert(el.find(KeyFieldEditor).length === 1)
        })

        it('calls onSave prop', () => {
            const onSavePromise = Promise.resolve()
            const onSaveStub = sinon.stub().callsFake(() => onSavePromise)
            const el = shallow(<KeyField
                keyName="myKey"
                keyId="testValue"
                allowEdit
                onSave={onSaveStub}
            />)

            el.instance().onEdit()

            const editor = el.find(KeyFieldEditor).shallow().instance()
            editor.setState({
                keyName: 'newKey',
                keyId: 'newName',
            })
            editor.onSave()

            return onSavePromise.then(() => {
                assert(onSaveStub.calledOnce)
                assert(onSaveStub.calledWith('newKey', 'newName'))
            })
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

        it('calls onDelete prop', () => {
            const spy = sinon.spy()
            const el = shallow(<KeyField
                keyName="myKey"
                value="testValue"
                allowDelete
                onDelete={spy}
            />)

            el.instance().onDelete()

            assert(spy.calledOnce)
        })
    })
})
