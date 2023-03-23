import BN from 'bignumber.js'
import { priceForTimeUnits } from '$mp/utils/price'
import { getTokenAllowance, setTokenAllowance } from '$app/src/services/marketplace'
import { SmartContractProject } from '$app/src/services/projects'
import Transaction from '$shared/utils/Transaction'
import {TimeUnit} from "$shared/utils/timeUnit"
import { NumberString} from '../types/common-types'

const REQUEST_INFITE_ALLOWANCE = true
const INFINITE_ALLOWANCE = new BN(2).pow(256).minus(1)

type ApproveProps = {
    contractProject: SmartContractProject
    length: NumberString,
    timeUnit: TimeUnit,
    chainId: number,
}

export const needsAllowance = async ({ contractProject, length, timeUnit, chainId }: ApproveProps): Promise<boolean> => {
    const paymentDetails = contractProject.paymentDetails[0]
    if (!paymentDetails) {
        throw new Error('Could not get payment details for selected chain')
    }

    const pricePerSecond = new BN(paymentDetails.pricePerSecond)
    const purchasePrice = priceForTimeUnits(pricePerSecond, length, timeUnit)
    if (!purchasePrice) {
        throw new Error('Could not calculate price')
    }

    const allowance = await getTokenAllowance(paymentDetails.pricingTokenAddress, chainId) || new BN(0)
    const needsAllowance = allowance.isLessThan(purchasePrice)

    return needsAllowance
}

export const approve = ({ contractProject, length, timeUnit, chainId }: ApproveProps): Transaction => {
    if (!contractProject) {
        throw new Error('No contract project provided')
    }

    if (!length || !timeUnit) {
        throw new Error('No length and/or time unit provided')
    }

    const paymentDetails = contractProject.paymentDetails[0]
    if (!paymentDetails) {
        throw new Error('Could not get payment details for selected chain')
    }

    const pricePerSecond = new BN(paymentDetails.pricePerSecond)
    const purchasePrice = priceForTimeUnits(pricePerSecond, length, timeUnit)
    if (!purchasePrice) {
        throw new Error('Could not calculate price')
    }

    const allowance = REQUEST_INFITE_ALLOWANCE ? INFINITE_ALLOWANCE : purchasePrice
    return setTokenAllowance(allowance, paymentDetails.pricingTokenAddress, chainId)
}
