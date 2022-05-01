import WalletLockedError from '$shared/errors/WalletLockedError'
import getWeb3 from '$utils/web3/getWeb3'

export default async function getDefaultWeb3Account() {
    let accounts

    try {
        accounts = await getWeb3().eth.getAccounts()
    } catch (e) {
        throw new WalletLockedError()
    }

    if (!Array.isArray(accounts) || accounts.length === 0) {
        throw new WalletLockedError()
    }

    return accounts[0]
}
