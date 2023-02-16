import React, {FunctionComponent} from "react"
import {act, render} from "@testing-library/react"
import {AuthenticationController, AuthenticationControllerContextProvider} from "$auth/authenticationController"
import {useAuthController} from "$auth/hooks/useAuthController"
import {
    getAuthenticationFromStorage,
    removeAuthenticationFromStorage,
    setAuthenticationInStorage
} from "$auth/authenticationStorage"
import {Authentication} from "$auth/authModel"
import address0 from "$utils/address0"
import Web3Poller, {events} from "$shared/web3/Web3Poller"
import Mock = jest.Mock
jest.mock('./authenticationStorage', () => {
    return {
        getAuthenticationFromStorage: jest.fn(),
        removeAuthenticationFromStorage: jest.fn(),
        setAuthenticationInStorage: jest.fn()
    }
})
jest.mock('$shared/modules/user/services', () => {
    return {
        getEnsDomains: async () => ({data: {domains: []}})
    }
})

describe('AuthenticationController', () => {
    const stubSession: Authentication = {
        method: 'metamask',
        address: '0x615996D0Ce59cE34d42f032c71149d9702C9b9eF',
        ensName: 'testing.eth'
    }
    let TestComponent: FunctionComponent
    let controller: AuthenticationController
    beforeEach(() => {
        jest.spyOn(Web3Poller, 'subscribe')
        jest.spyOn(Web3Poller, 'unsubscribe')
        const Component = () => {
            controller = useAuthController()
            return <></>
        }
        TestComponent = Component
    })

    it('should read from the storage on startup', () => {
        (getAuthenticationFromStorage as Mock).mockReturnValueOnce(stubSession)
        render(<AuthenticationControllerContextProvider>
            <TestComponent/>
        </AuthenticationControllerContextProvider>)
        expect(getAuthenticationFromStorage).toHaveBeenCalled()
        expect(controller.currentAuthSession).toEqual(stubSession)
    })

    it('should subscribe to Web3Poller at startup and unsubscribe on unmount', () => {
        (getAuthenticationFromStorage as Mock).mockReturnValueOnce(stubSession)
        const renderResult = render(<AuthenticationControllerContextProvider>
            <TestComponent/>
        </AuthenticationControllerContextProvider>)
        expect(Web3Poller.subscribe).toHaveBeenCalledWith(events.ACCOUNT, expect.any(Function))
        expect(Web3Poller.subscribe).toHaveBeenCalledWith(events.ACCOUNT_ERROR, expect.any(Function))
        renderResult.unmount()
        expect(Web3Poller.subscribe).toHaveBeenCalledWith(events.ACCOUNT, expect.any(Function))
        expect(Web3Poller.subscribe).toHaveBeenCalledWith(events.ACCOUNT_ERROR, expect.any(Function))

    })

    it('should set and get the session', async () => {
        render(<AuthenticationControllerContextProvider>
            <TestComponent/>
        </AuthenticationControllerContextProvider>)
        expect(controller.currentAuthSession).toEqual({address: undefined, method: undefined})
        const newSession = {address: address0, method: 'SomeMethod'}
        await act(async () => await controller.updateAuthSession(newSession))
        expect(controller.currentAuthSession).toEqual(newSession)
        expect(setAuthenticationInStorage).toHaveBeenCalledWith(newSession)
    })

    it('should remove the session', () => {
        (getAuthenticationFromStorage as Mock).mockReturnValueOnce(stubSession)
        render(<AuthenticationControllerContextProvider>
            <TestComponent/>
        </AuthenticationControllerContextProvider>)
        act(() => controller.removeAuthSession())
        expect(controller.currentAuthSession).toEqual({address: undefined, method: undefined})
        expect(removeAuthenticationFromStorage).toHaveBeenCalled()
    })
})
