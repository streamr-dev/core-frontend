import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'
import sinon from 'sinon'

import * as userActions from '$shared/modules/user/actions'

import { ProfileSettings, mapStateToProps, mapDispatchToProps } from '../../../../components/ProfilePage/ProfileSettings'

describe('ProfileSettings', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('componentDidMount', () => {
        it('must call props.getCurrentUser', () => {
            const spy = sinon.spy()
            shallow(<ProfileSettings
                user={{}}
                getCurrentUser={spy}
                updateCurrentUserName={() => {}}
                saveCurrentUser={() => {}}
            />)
            assert(spy.calledOnce)
        })
    })

    describe('onNameChange', () => {
        it('must call props.updateCurrentUserName', () => {
            const spy = sinon.spy()
            const el = shallow(<ProfileSettings
                user={{}}
                getCurrentUser={() => {}}
                updateCurrentUserName={spy}
                saveCurrentUser={() => {}}
            />)
            el.instance().onNameChange({
                target: {
                    value: 'testtest',
                },
            })
            assert(spy.calledOnce)
            assert(spy.calledWith('testtest'))
        })
    })

    describe('mapStateToProps', () => {
        it('must return right kind of object', () => {
            const user = {
                moi: 'moimoi',
            }
            assert.deepStrictEqual(mapStateToProps({
                user: {
                    user,
                },
            }), {
                user,
            })
        })
    })

    describe('mapDispatchToProps', () => {
        it('must return right kind of object with right type of attrs', () => {
            assert.equal(typeof mapDispatchToProps(), 'object')
            assert.equal(typeof mapDispatchToProps().getCurrentUser, 'function')
            assert.equal(typeof mapDispatchToProps().updateCurrentUserName, 'function')
        })

        describe('getCurrentUser', () => {
            it('must dispatch getCurrentUser', () => {
                const dispatchSpy = sinon.spy()
                const deleteStub = sandbox.spy(userActions, 'getUserData')
                mapDispatchToProps(dispatchSpy).getCurrentUser()
                assert(dispatchSpy.calledOnce)
                assert(deleteStub.calledOnce)
            })
        })
    })
})
