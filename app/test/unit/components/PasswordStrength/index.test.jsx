import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import PasswordStrength from '$shared/components/PasswordStrength'

describe(PasswordStrength.name, () => {
    const sandbox = sinon.createSandbox()

    const strength = (props, callback) => {
        const instance = mount(<PasswordStrength {...props} />).instance()
        process.nextTick(() => {
            callback(instance.strength())
        })
    }

    afterEach(() => {
        sandbox.restore()
    })

    describe('strength method', () => {
        it('gives -1 if disabled', (done) => {
            strength({
                value: 'pass',
                enabled: false,
            }, (value) => {
                expect(value).toEqual(-1)
                done()
            })
        })

        it('gives -1 if no value is given', (done) => {
            strength({
                enabled: true,
            }, (value) => {
                expect(value).toEqual(-1)
                done()
            })
        })

        it('gives 0 for weak password', (done) => {
            strength({
                value: 'qwerty',
                enabled: true,
            }, (value) => {
                expect(value).toEqual(0)
                done()
            })
        })

        it('gives 1 for "not strong" password', (done) => {
            strength({
                value: 'werty',
                enabled: true,
            }, (value) => {
                expect(value).toEqual(1)
                done()
            })
        })

        it('gives 2 for strong password', (done) => {
            strength({
                value: 'You shall not pass!',
                enabled: true,
            }, (value) => {
                expect(value).toEqual(2)
                done()
            })
        })
    })

    it('passes strength to child function', (done) => {
        const childrenStub = sandbox.stub().returns(<div />)
        mount(<PasswordStrength enabled value="You shall not pass!">{childrenStub}</PasswordStrength>)

        process.nextTick(() => {
            sinon.assert.calledWith(childrenStub, 2)
            done()
        })
    })
})
