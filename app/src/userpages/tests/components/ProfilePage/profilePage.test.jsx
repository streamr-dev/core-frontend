import React from 'react'
import { shallow } from 'enzyme'

import { ProfilePage } from '../../../components/ProfilePage'

jest.mock('react-redux', () => ({
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
    connect: jest.fn().mockImplementation(() => (action) => action),
}))

jest.mock('$shared/modules/integrationKey/hooks/usePrivateKeys', () => (
    jest.fn().mockImplementation(() => ({
        fetching: false,
    }))
))

jest.mock('$shared/modules/integrationKey/hooks/useEthereumIdentities', () => (
    jest.fn().mockImplementation(() => ({
        fetching: false,
    }))
))

describe('ProfilePageHandler', () => {
    describe('render', () => {
        it('should have a ProfileSettings', () => {
            const el = shallow(<ProfilePage />)
            expect(el.find('ProfileSettings')).toBeTruthy()
        })
        it('should have a APICredentials', () => {
            const el = shallow(<ProfilePage />)
            expect(el.find('APICredentials')).toBeTruthy()
        })
        it('should have a IntegrationKeyHandler', () => {
            const el = shallow(<ProfilePage />)
            expect(el.find('IntegrationKeyHandler')).toBeTruthy()
        })
        it('should have a IdentityHandler', () => {
            const el = shallow(<ProfilePage />)
            expect(el.find('IdentityHandler')).toBeTruthy()
        })
    })
})
