import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import BN from 'bignumber.js'
import { priceForTimeUnits } from '$mp/utils/price'
import { validateBalanceForPurchase, getCustomTokenDecimals } from '$mp/utils/web3'
import { transactionStates, transactionTypes } from '$shared/utils/constants'
import ActionQueue from '$mp/utils/actionQueue'
import { buyProject, getTokenAllowance, setTokenAllowance } from '$app/src/services/marketplace'
import { addTransaction } from '$mp/modules/transactions/actions'
import { toSeconds } from '$mp/utils/time'
import { fromDecimals } from '$mp/utils/math'
import { SmartContractProject } from '$app/src/services/projects'
import { NumberString, TimeUnit } from '../types/common-types'

const INFINITE_ALLOWANCE = new BN(2).pow(256).minus(1)

type ApproveProps = {
    contractProject: SmartContractProject
    length: NumberString,
    timeUnit: TimeUnit,
    chainId: number,
}

const useApproveAllowance = () => {
    const dispatch = useDispatch()

    const needsAllowance = useCallback(async ({ contractProject, length, timeUnit, chainId }: ApproveProps) => {
        const paymentDetails = contractProject.paymentDetails[0]
        if (!paymentDetails) {
            throw new Error('could not get payment details for selected chain')
        }

        const pricePerSecond = new BN(paymentDetails.pricePerSecond)
        const purchasePrice = priceForTimeUnits(pricePerSecond, length, timeUnit)
        if (!purchasePrice) {
            throw new Error('could not calculate price')
        }

        const allowance = await getTokenAllowance(paymentDetails.pricingTokenAddress, chainId) || new BN(0)
        const needsAllowance = allowance.isLessThan(purchasePrice)

        return needsAllowance
    }, [])

    const approve = useCallback(({ contractProject, length, timeUnit, chainId }: ApproveProps) => {
        if (!contractProject) {
            throw new Error('no project')
        }

        if (!length || !timeUnit) {
            throw new Error('no length and/or time unit provided')
        }

        const paymentDetails = contractProject.paymentDetails[0]
        if (!paymentDetails) {
            throw new Error('could not get payment details for selected chain')
        }

        const pricePerSecond = new BN(paymentDetails.pricePerSecond)
        const purchasePrice = priceForTimeUnits(pricePerSecond, length, timeUnit)
        if (!purchasePrice) {
            throw new Error('could not calculate price')
        }

        return setTokenAllowance(INFINITE_ALLOWANCE, paymentDetails.pricingTokenAddress, chainId)
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.SET_DATA_ALLOWANCE))
            })
            .onTransactionComplete(() => {
            })
            .onError((error) => {
                console.error(error)
            })
    }, [dispatch])

    return {
        approve,
        needsAllowance,
    }
}

export default useApproveAllowance
