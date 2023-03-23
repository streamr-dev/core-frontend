import { createAction } from 'redux-actions'
import BN from 'bignumber.js'
import { Balances } from '$shared/types/user-types'
import { BalanceType } from '$shared/types/user-types'
import { Address } from '$shared/types/web3-types'
import { isEthereumAddress } from '$mp/utils/validate'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'
import { SetBalanceActionCreator } from './types'
import * as services from './services'
import {
    SET_BALANCE,
} from './constants'

// account balances
const setBalance: SetBalanceActionCreator = createAction(SET_BALANCE, (balances: Balances) => ({
    balances,
}))
export const updateBalance =
    (account: Address) => async (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {
        const state = getState()
        const chainId = selectEthereumNetworkId(state)
        let accountEthBalance = new BN(0)
        let accountDataBalance = new BN(0)

        try {
            accountEthBalance = await services.getBalance({
                address: account,
                type: BalanceType.ETH,
                usePublicNode: true,
                chainId,
            })
        } catch (e) {
            console.warn(e)
        }

        try {
            accountDataBalance = await services.getBalance({
                address: account,
                type: BalanceType.DATA,
                usePublicNode: true,
                chainId,
            })
        } catch (e) {
            console.warn(e)
        }

        dispatch(
            setBalance({
                [BalanceType.ETH]: accountEthBalance.toString(),
                [BalanceType.DATA]: accountDataBalance.toString(),
            }),
        )
    }
export const updateBalances =
    (address: Address) => (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {

        if (!!address && isEthereumAddress(address)) {
            dispatch(updateBalance(address))
        }
    }
