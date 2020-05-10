import React from 'react'
import { shallow } from 'enzyme'
import assert from 'assert-diff'

import { ProfilePage } from '../../../components/ProfilePage'

jest.mock('react-redux', () => ({
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
    connect: jest.fn().mockImplementation(() => (action) => action),
}))

describe('ProfilePageHandler', () => {
    describe('render', () => {
        it('should have a ProfileSettings', () => {
            const el = shallow(<ProfilePage />)
            assert(el.find('ProfileSettings'))
        })
        it('should have a APICredentials', () => {
            const el = shallow(<ProfilePage />)
            assert(el.find('APICredentials'))
        })
        it('should have a IntegrationKeyHandler', () => {
            const el = shallow(<ProfilePage />)
            assert(el.find('IntegrationKeyHandler'))
        })
        it('should have a IdentityHandler', () => {
            const el = shallow(<ProfilePage />)
            assert(el.find('IdentityHandler'))
        })
    })
})
