import WalletLockedError from '$shared/errors/WalletLockedError'
import getWeb3 from '$utils/web3/getWeb3'
// TODO add typing
export default async function getDefaultWeb3Account(): Promise<any> {
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
