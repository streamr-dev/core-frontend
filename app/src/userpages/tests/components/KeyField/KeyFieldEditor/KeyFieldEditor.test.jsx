import React from 'react'
import { mount } from 'enzyme'
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
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
            />)

            assert(el.exists('#keyName'))
            expect(el.find('#keyName').hostNodes()).toHaveLength(1)
            assert(el.exists('#keyValue'))
            expect(el.find('#keyValue').hostNodes()).toHaveLength(1)
            assert(el.find('Label').at(0).text() === 'apiKey')
            assert(el.find('Label').at(1).text() === 'apiKey')
        })

        it('shows correct text for save button', () => {
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
            />)
            assert(el.find('Buttons').prop('actions').save.title === 'save')
        })

        it('shows save button as disabled if value is empty', () => {
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
            />)
            assert(el.find('Buttons').prop('actions').save.disabled === true)
        })

        it('shows the value as readonly', () => {
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
            />)

            assert(el.find('Text').at(1).prop('readOnly') === true)
        })

        it('calls onSave prop', () => {
            const spy = sandbox.spy()
            const el = mount(<KeyFieldEditor
                onSave={spy}
            />)

            el.find('Buttons').prop('actions').save.onClick()

            assert(spy.calledOnce)
        })

        it('shows an error as part of the value field', () => {
            const error = 'Something happened'
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
                error={error}
            />)

            assert(el.find('Errors').text() === error)
        })
    })

    describe('createNew', () => {
        it('shows only key name input when createNew flag is set', () => {
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
                createNew
            />)

            assert(el.find('Text').length === 1)
            assert(el.find('Label').text() === 'apiKey')
        })

        it('shows correct text for save button', () => {
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
                createNew
            />)
            assert(el.find('Buttons').prop('actions').save.title === 'add')
        })

        it('shows an error as part of the name field', () => {
            const error = 'Something happened'
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
                createNew
                error={error}
            />)

            assert(el.find('Errors').text() === error)
        })

        it('shows save button as disabled unless name is given', () => {
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
                createNew
            />)

            assert(el.find('Buttons').prop('actions').save.disabled === true)

            el.find('#keyName').hostNodes().simulate('change', {
                target: {
                    value: 'name',
                },
            })
            assert(el.find('Buttons').prop('actions').save.disabled !== true)
        })
    })

    describe('showValue', () => {
        it('shows the value', () => {
            const el = mount(<KeyFieldEditor
                onSave={() => {}}
                showValue
            />)

            assert(el.find('Text').at(1).prop('id') === 'keyValue')
            assert(el.find('Text').at(1).prop('readOnly') === true)
        })
    })
})
