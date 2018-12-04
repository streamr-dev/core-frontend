import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import FormControl from '$shared/components/FormControl'
import PasswordStrength from '$shared/components/PasswordStrength'
import InputError from '$shared/components/FormControl/InputError'

describe(FormControl.name, () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('label', () => {
        it('displays label from props for negative strength', (done) => {
            const el = mount(<FormControl label="fancy label" type="password" value="" measureStrength />)
            process.nextTick(() => {
                expect(el.find('label').text()).toBe('fancy label')
                done()
            })
        })

        it('displays "weak password" message for 0 strength', (done) => {
            const el = mount(<FormControl label="fancy label" type="password" value="qwerty" measureStrength />)
            process.nextTick(() => {
                expect(el.find('label').text()).toBe('weak')
                done()
            })
        })

        it('displays "moderate password" message for 1 strength', (done) => {
            const el = mount(<FormControl label="fancy label" type="password" value="werty" measureStrength />)
            process.nextTick(() => {
                expect(el.find('label').text()).toBe('moderate')
                done()
            })
        })

        it('displays "strong password" message for 2 strength', (done) => {
            const el = mount(<FormControl label="fancy label" type="password" value="You shall not pass!" measureStrength />)
            process.nextTick(() => {
                expect(el.find('label').text()).toBe('strong')
                done()
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

    describe('PasswordStrength props', () => {
        const el = (props) => mount((
            <FormControl label="bar" value="foo" {...props} />
        )).find(PasswordStrength)

        it('incl. the value', () => {
            expect(el({
                value: 'value',
            }).props()).toMatchObject({
                enabled: false,
                value: 'value',
            })
        })

        it('incl. enabled: false for non-password type', () => {
            expect(el({
                measureStrength: true,
                type: 'text',
            }).props()).toMatchObject({
                enabled: false,
            })
        })

        it('incl. enabled: false for falsy measureStrength', () => {
            expect(el({
                measureStrength: false,
                type: 'password',
            }).props()).toMatchObject({
                enabled: false,
            })
        })

        it('incl. enabled: true for measureStrength: true', () => {
            expect(el({
                type: 'password',
                measureStrength: true,
            }).props()).toMatchObject({
                enabled: true,
            })
        })
    })

    describe('errors', () => {
        const errorMessage = (props) => mount((
            <FormControl
                label="Label"
                preserveErrorSpace
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
