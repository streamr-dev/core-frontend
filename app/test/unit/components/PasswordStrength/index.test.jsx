import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import PasswordStrength from '$shared/components/PasswordStrength'

describe(PasswordStrength.name, () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('passing strength to children', () => {
        it('passes -1 if disabled', (done) => {
            const childrenStub = sandbox.stub().returns(<div />)
            mount(<PasswordStrength value="You shall not pass!">{childrenStub}</PasswordStrength>)

            process.nextTick(() => {
                sinon.assert.calledWith(childrenStub, -1)
                done()
            })
        })

        it('passes -1 if no value is given', (done) => {
            const childrenStub = sandbox.stub().returns(<div />)
            mount(<PasswordStrength enabled>{childrenStub}</PasswordStrength>)

            process.nextTick(() => {
                sinon.assert.calledWith(childrenStub, -1)
                done()
            })
        })

        it('passes 0 for weak password', (done) => {
            const childrenStub = sandbox.stub().returns(<div />)
            mount(<PasswordStrength value="qwerty" enabled>{childrenStub}</PasswordStrength>)

            process.nextTick(() => {
                sinon.assert.calledWith(childrenStub, 0)
                done()
            })
        })

        it('passes 1 for moderate password', (done) => {
            const childrenStub = sandbox.stub().returns(<div />)
            mount(<PasswordStrength value="werty" enabled>{childrenStub}</PasswordStrength>)

            process.nextTick(() => {
                sinon.assert.calledWith(childrenStub, 1)
                done()
            })
        })

        it('passes 1 for moderate password', (done) => {
            const childrenStub = sandbox.stub().returns(<div />)
            mount(<PasswordStrength value="You shall not pass!" enabled>{childrenStub}</PasswordStrength>)

            process.nextTick(() => {
                sinon.assert.calledWith(childrenStub, 2)
                done()
            })
        })
    })
})
