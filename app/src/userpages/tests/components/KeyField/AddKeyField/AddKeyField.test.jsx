import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

import AddKeyField from '$userpages/components/KeyField/AddKeyField'

describe('AddKeyField', () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('basic', () => {
        it('displays a button', () => {
            const label = 'Add new'
            const el = shallow(<AddKeyField
                label={label}
            />)

            assert(el.find('Button').shallow().text() === label)
        })

        it('shows an editor once clicked', () => {
            const label = 'Add new'
            const el = shallow(<AddKeyField
                label={label}
            />)

            el.find('Button').simulate('click', { preventDefault() {} })

            assert(el.find('Button').length === 0)
            assert(el.find('KeyFieldEditor').length === 1)
        })
    })

    describe('cancel', () => {
        it('hides the editor if cancel is clicked', () => {
            const label = 'Add new'
            const el = shallow(<AddKeyField
                label={label}
            />)

            el.find('Button').simulate('click', { preventDefault() {} })

            assert(el.find('Button').length === 0)
            assert(el.find('KeyFieldEditor').length === 1)

            el.find('KeyFieldEditor').prop('onCancel')()

            assert(el.find('Button').length === 1)
            assert(el.find('KeyFieldEditor').length === 0)
        })
    })

    describe('saving', () => {
        it('hides the editor when saved', (done) => {
            const label = 'Add new'
            const onSave = () => Promise.resolve()
            const el = shallow(<AddKeyField
                label={label}
                onSave={onSave}
            />)

            el.find('Button').simulate('click', { preventDefault() {} })

            assert(el.find('Button').length === 0)
            assert(el.find('KeyFieldEditor').length === 1)

            el.find('KeyFieldEditor').prop('onSave')()

            // We need to wait for 2nd setState to happen after onSave was called
            setTimeout(() => (
                onSave()
                    .then(() => {
                        assert(el.find('Button').length === 1)
                        assert(el.find('KeyFieldEditor').length === 0)
                        done()
                    })
            ), 0)
        })

        it('shows an error when saving fails', (done) => {
            const label = 'Add new'
            const errorMessage = 'error'
            const error = new Error(errorMessage)
            const onSave = () => Promise.reject(error)
            const el = shallow(<AddKeyField
                label={label}
                onSave={onSave}
            />)

            el.find('Button').simulate('click', { preventDefault() {} })

            assert(el.find('Button').length === 0)
            assert(el.find('KeyFieldEditor').length === 1)

            try {
                el.find('KeyFieldEditor').prop('onSave')()
            } catch (e) {
                assert(e === error)
            }

            // We need to wait for 2nd setState to happen after onSave was called
            setTimeout(() => (
                onSave()
                    .catch(() => {
                        assert(el.find('KeyFieldEditor').length === 1)
                        assert(el.find('KeyFieldEditor').prop('error') === errorMessage)
                        done()
                    })
            ), 0)
        })
    })
})
