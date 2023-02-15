import {AuthenticationController} from "$auth/authenticationController"
import address0 from "$utils/address0"

export const authenticationControllerStub: AuthenticationController = {
    currentAuthSession: {
        address: address0,
        method: 'metamask'
    },
    updateAuthSession: async () => {},
    removeAuthSession: () => {}
}
