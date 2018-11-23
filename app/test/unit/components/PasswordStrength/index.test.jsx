import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import * as zxcvbn from '$utils/zxcvbn'

import PasswordStrength from '$shared/components/PasswordStrength'

describe(PasswordStrength.name, () => {
    const sandbox = sinon.createSandbox()

    const getStrength = async (props) => (
        mount(<PasswordStrength {...props} />).instance().getStrength()
    )

    const stubZxcvbn = (score) => {
        sandbox.stub(zxcvbn, 'default').callsFake(() => Promise.resolve(() => ({
            score,
        })))
    }

    afterEach(() => {
        sandbox.restore()
    })

    describe('getStrength method', () => {
        it('gives -1 if disabled', async () => {
            expect(await getStrength({
                value: 'pass',
                enabled: false,
            })).toEqual(-1)
        })

        it('gives -1 if no value is given', async () => {
            expect(await getStrength({
                enabled: true,
            })).toEqual(-1)
        })

        it('gives 0 for zxcvbn\'s score 0', async () => {
            stubZxcvbn(0)
            expect(await getStrength({
                value: 'x',
                enabled: true,
            })).toEqual(0)
        })

        it('gives 1 for zxcvbn\'s score 1', async () => {
            stubZxcvbn(1)
            expect(await getStrength({
                value: 'x',
                enabled: true,
            })).toEqual(1)
        })

        it('gives 1 for zxcvbn\'s score 2', async () => {
            stubZxcvbn(2)
            expect(await getStrength({
                value: 'x',
                enabled: true,
            })).toEqual(1)
        })

        it('gives 2 for zxcvbn\'s score 3', async () => {
            stubZxcvbn(3)
            expect(await getStrength({
                value: 'x',
                enabled: true,
            })).toEqual(2)
        })

        it('gives 2 for zxcvbn\'s score 4', async () => {
            stubZxcvbn(4)
            expect(await getStrength({
                value: 'x',
                enabled: true,
            })).toEqual(2)
        })
    })

    it('passes strength to child function', (done) => {
        stubZxcvbn(4)
        const childrenStub = sandbox.stub().returns(<div />)
        mount(<PasswordStrength enabled value="pass">{childrenStub}</PasswordStrength>)

        process.nextTick(() => {
            sinon.assert.calledWith(childrenStub, 2)
            done()
        })
    })
})
