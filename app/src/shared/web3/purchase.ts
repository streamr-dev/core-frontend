import BN from 'bignumber.js'
import { priceForTimeUnits } from '$mp/utils/price'
import { validateBalanceForPurchase, getCustomTokenDecimals } from '$mp/utils/web3'
import { buyProject } from '$app/src/services/marketplace'
import { toSeconds } from '$mp/utils/time'
import { fromDecimals } from '$mp/utils/math'
import { SmartContractProject } from '$app/src/services/projects'
import Transaction from '$shared/utils/Transaction'
import { NumberString, TimeUnit } from '../types/common-types'

type PurchaseProps = {
    contractProject: SmartContractProject
    length: NumberString,
    timeUnit: TimeUnit,
    chainId: number,
}

export const purchaseProject = async ({ contractProject, length, timeUnit, chainId }: PurchaseProps): Promise<Transaction> => {
    if (!contractProject) {
        throw new Error('No contract project provided')
    }

    if (!length || !timeUnit) {
        throw new Error('No length and/or time unit provided')
    }

    const paymentDetails = contractProject.paymentDetails[0] // contractProject has only chains we asked to load
    if (!paymentDetails) {
        throw new Error('Could not get payment details for selected chain')
    }

    const pricePerSecond = new BN(paymentDetails.pricePerSecond)
    const purchasePrice = priceForTimeUnits(pricePerSecond, length, timeUnit)
    if (!purchasePrice) {
        throw new Error('Could not calculate price')
    }

    const pricingTokenDecimals = await getCustomTokenDecimals(paymentDetails.pricingTokenAddress, chainId)
    await validateBalanceForPurchase({
        price: fromDecimals(purchasePrice, pricingTokenDecimals),
        pricingTokenAddress: paymentDetails.pricingTokenAddress,
    })

    // Do the actual purchase
    const subscriptionInSeconds = toSeconds(length, timeUnit)

    return buyProject(
        contractProject.id,
        subscriptionInSeconds,
        contractProject.chainId,
    )
}
