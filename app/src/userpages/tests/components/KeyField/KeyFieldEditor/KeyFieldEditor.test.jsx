import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

import KeyFieldEditor from '$userpages/components/KeyField/KeyFieldEditor'

describe('KeyFieldEditor', () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('basic', () => {
        it('shows text input for key name and value', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
            />)

            assert(el.exists('.keyName Text'))
            assert(el.exists('.keyValue Text'))
            assert(el.find('Label').at(0).text() === 'apiKey')
            assert(el.find('Label').at(1).text() === 'apiKey')
        })

        it('shows correct text for save button', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
            />)
            assert(el.find('Buttons').prop('actions').save.title === 'save')
        })

        it('shows save button as disabled if value is empty', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
            />)
            assert(el.find('Buttons').prop('actions').save.disabled === true)
        })

        it('shows save button as disabled unless both values are given', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
            />)

            el.setState({
                keyName: 'name',
            })
            assert(el.find('Buttons').prop('actions').save.disabled === true)

            el.setState({
                keyName: null,
                keyId: 'value',
            })
            assert(el.find('Buttons').prop('actions').save.disabled === true)

            el.setState({
                keyName: 'name',
                keyId: 'value',
            })
            assert(el.find('Buttons').prop('actions').save.disabled !== true)
        })

        it('shows the value as readonly', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
            />)

            assert(el.find('Text').at(1).prop('readOnly') === true)
        })

        it('calls onSave prop', () => {
            const spy = sandbox.spy()
            const el = shallow(<KeyFieldEditor
                onSave={spy}
            />)

            el.find('Buttons').prop('actions').save.onClick()

            assert(spy.calledOnce)
        })

        it('shows an error as part of the value field', () => {
            const error = 'Something happened'
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
                error={error}
            />)

            assert(el.find('Errors').text() === error)
        })
    })

    describe('createNew', () => {
        it('shows only key name input when createNew flag is set', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
                createNew
            />)

            assert(el.find('Text').length === 1)
            assert(el.find('Label').text() === 'apiKey')
        })

        it('shows correct text for save button', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
                createNew
            />)
            assert(el.find('Buttons').prop('actions').save.title === 'add')
        })

        it('shows an error as part of the name field', () => {
            const error = 'Something happened'
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
                createNew
                error={error}
            />)

            assert(el.find('Errors').text() === error)
        })

        it('shows save button as disabled unless name is given', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
                createNew
            />)

            assert(el.find('Buttons').prop('actions').save.disabled === true)

            el.setState({
                keyName: 'name',
            })
            assert(el.find('Buttons').prop('actions').save.disabled !== true)
        })
    })

    describe('editValue', () => {
        it('allows to edit the value', () => {
            const el = shallow(<KeyFieldEditor
                onSave={() => {}}
                editValue
            />)

            assert(el.find('Text').at(1).prop('id') === 'keyValue')
            assert(el.find('Text').at(1).prop('readOnly') === false)
        })
    })
})
