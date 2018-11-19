import React from 'react'
import { mount } from 'enzyme'
import zxcvbn from 'zxcvbn'
import sinon from 'sinon'

import FormControl from '$shared/components/FormControl'
import InputError from '$shared/components/FormControl/InputError'

describe(FormControl.name, () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('methods', () => {
        describe('#strengthLevel', () => {
            const control = (props) => mount((
                <FormControl
                    label="Label"
                    type="password"
                    measureStrength
                    value="x"
                    {...props}
                />
            ))
                .instance()
                .strengthLevel()

            it('gives non-negative value for a non-empty password field with measureStrength flag set', () => {
                expect(zxcvbn('x').score).toBe(0) // — making sure.
                expect(control({})).toBe(0)
            })

            it('gives -1 for a non-password input', () => {
                expect(control({
                    type: 'text',
                })).toBe(-1)
            })

            it('gives -1 if measureStrength is not set', () => {
                expect(control({
                    measureStrength: false,
                })).toBe(-1)
            })

            it('gives -1 for an empty field', () => {
                expect(control({
                    value: '',
                })).toBe(-1)
            })
        })
    })

    describe('label', () => {
        const mockStrength = (strengthLevel, callback) => {
            sandbox.stub(FormControl.prototype, 'strengthLevel').callsFake(() => strengthLevel)
            const el = mount(<FormControl label="fancy label" type="password" />)
            callback(el.find('label').text())
        }

        it('displays label from props for negative strength', () => {
            mockStrength(-1, (label) => {
                expect(label).toBe('fancy label')
            })
        })

        it('displays "weak password" message for 0 strength', () => {
            mockStrength(0, (label) => {
                expect(label).toEqual('weak')
            })
        })

        it('displays "moderate password" message for 1 strength', () => {
            mockStrength(1, (label) => {
                expect(label).toEqual('moderate')
            })
        })

        it('displays "strong password" message for 2 strength', () => {
            mockStrength(2, (label) => {
                expect(label).toEqual('strong')
            })
        })
    })

    it('passes selected props to the wrapped component instance', () => {
        const wrapped = sandbox.spy()
        const el = mount((
            <FormControl label="bar" value="foo">
                {wrapped}
            </FormControl>
        ))
        const { onFocusChange, setAutoCompleted } = el.instance()

        sinon.assert.neverCalledWith(wrapped, sinon.match.has('label'))
        sinon.assert.calledWith(wrapped, sinon.match.has('value', 'foo'))
        sinon.assert.calledWith(wrapped, sinon.match.has('onFocusChange', onFocusChange))
        sinon.assert.calledWith(wrapped, sinon.match.has('setAutoCompleted', setAutoCompleted))
        sinon.assert.calledWith(wrapped, sinon.match.has('setAutoCompleted', setAutoCompleted))
    })

    describe('errors', () => {
        const errorMessage = (props) => mount((
            <FormControl
                label="Label"
                {...props}
            />
        ))
            .find(InputError).text()

        it('gets rendered as an empty error block by default', () => {
            expect(errorMessage({})).toEqual('')
        })

        it('displays the last known error', () => {
            expect(errorMessage({
                error: 'last known error',
            })).toEqual('last known error')
        })

        it('is empty when the instance is processing', () => {
            expect(errorMessage({
                error: 'last known error',
                processing: true,
            })).toEqual('')
        })
    })
})
