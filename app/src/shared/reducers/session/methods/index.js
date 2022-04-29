import { getMethod } from '$shared/utils/sessionToken'
import Metamask from './Metamask'
import WalletConnect from './WalletConnect'

const methods = [Metamask, WalletConnect]

export function getRecentMethod() {
    const methodId = getMethod()

    return methods.find(({ id }) => id === methodId)
}

export default methods
