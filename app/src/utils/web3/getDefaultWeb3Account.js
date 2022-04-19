import WalletLockedError from '$shared/errors/WalletLockedError'

export default async function getDefaultWeb3Account({ eth }) {
    let accounts

    try {
        accounts = await eth.getAccounts()
    } catch (e) {
        throw new WalletLockedError()
    }

    if (!Array.isArray(accounts) || accounts.length === 0) {
        throw new WalletLockedError()
    }

    return accounts[0]
}
