import { isAddress } from 'web3-validator'
import { SalePoint } from '~/marketplace/types/project-types'
import { isPriceValid } from '~/marketplace/utils/price'
import { timeUnits } from '~/shared/utils/timeUnit'
import { MaxSearchPhraseLength } from '~/consts'
export const isValidSearchQuery = (value: string): boolean =>
    value.length <= MaxSearchPhraseLength
export const isEthereumAddress = (value: string): boolean => isAddress(value)

// returns invalid field names array
export const validateSalePoint = (
    salePoint: SalePoint,
    isDataUnion?: boolean,
): string[] | null => {
    const invalidFields: string[] = []

    if (!salePoint.timeUnit || !timeUnits[salePoint.timeUnit]) {
        invalidFields.push('timeUnit')
    }

    if (!isPriceValid(salePoint.price)) {
        invalidFields.push('price')
    }

    if (
        !salePoint.pricingTokenAddress ||
        !isEthereumAddress(salePoint.pricingTokenAddress)
    ) {
        invalidFields.push('pricingTokenAddress')
    }

    if (!salePoint.pricePerSecond || !isPriceValid(salePoint.pricePerSecond)) {
        invalidFields.push('pricePerSecond')
    }

    if (!salePoint.chainId) {
        invalidFields.push('chainId')
    }

    if (
        !isDataUnion &&
        (!salePoint.beneficiaryAddress ||
            !isEthereumAddress(salePoint.beneficiaryAddress))
    ) {
        invalidFields.push('beneficiaryAddress')
    }

    return invalidFields.length ? invalidFields : null
}
