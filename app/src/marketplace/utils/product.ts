import BN from 'bignumber.js'
import * as yup from 'yup'
import type { NumberString } from '$shared/types/common-types'
import { contractCurrencies as currencies, projectStates } from '$shared/utils/constants'
import InvalidHexStringError from '$shared/errors/InvalidHexStringError'
import type { Project, ProjectId, SmartContractProduct, ProjectType, ContactDetails } from '../types/project-types'
import { ProjectState } from '../types/project-types'
import { isEthereumAddress } from './validate'
import { isPriceValid } from './price'
import { projectTypes } from './constants'
import { toDecimals, fromDecimals } from './math'
import { getPrefixedHexString, getUnprefixedHexString, isValidHexString } from './smartContract'

export const isPaidProduct = (product: Project): boolean => product.isFree === false || new BN(product.pricePerSecond).isGreaterThan(0)

export const isDataUnionProduct = (productOrProductType?: Project | ProjectType): boolean => {
    const { type } =
        typeof productOrProductType === 'string'
            ? {
                type: productOrProductType,
            }
            : productOrProductType || {}
    return type === projectTypes.DATAUNION
}

export const validateProductPriceCurrency = (priceCurrency: string): void => {
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)

    if (currencyIndex < 0) {
        throw new Error(`Invalid currency: ${priceCurrency}`)
    }
}

export const validateApiProductPricePerSecond = (pricePerSecond: NumberString | BN): void => {
    if (new BN(pricePerSecond).isLessThan(0)) {
        throw new Error('Product price must be equal to or greater than 0')
    }
}

export const validateContractProductPricePerSecond = (pricePerSecond: NumberString | BN): void => {
    if (new BN(pricePerSecond).isLessThanOrEqualTo(0)) {
        throw new Error('Product price must be greater than 0 to publish')
    }
}

export const mapPriceFromContract = (pricePerSecond: NumberString, decimals: BN): string => fromDecimals(pricePerSecond, decimals).toString()
export const mapPriceToContract = (pricePerSecond: NumberString | BN, decimals: BN): string => toDecimals(pricePerSecond, decimals).toFixed(0)
export const mapPriceFromApi = (pricePerSecond: NumberString): string => (pricePerSecond ? pricePerSecond.toString() : '0')
export const mapPriceToApi = (pricePerSecond: NumberString | BN): string => (pricePerSecond ? pricePerSecond.toString() : '0')

export const mapProductFromContract = (id: ProjectId, result: any, chainId: number, pricingTokenDecimals: BN): SmartContractProduct => {
    const minimumSubscriptionSeconds = parseInt(result.minimumSubscriptionSeconds, 10)
    return {
        id,
        name: result.name,
        ownerAddress: result.owner,
        beneficiaryAddress: result.beneficiary,
        pricePerSecond: result.pricePerSecond,
        minimumSubscriptionInSeconds: Number.isNaN(minimumSubscriptionSeconds) ? 0 : minimumSubscriptionSeconds,
        state: (Object.keys(projectStates) as ProjectState[])[result.state],
        requiresWhitelist: result.requiresWhitelist,
        chainId,
        pricingTokenAddress: result.pricingTokenAddress,
        pricingTokenDecimals: pricingTokenDecimals.toNumber(),
    }
}

export const mapProductFromApi = (product: Project): Project => {
    const pricePerSecond = mapPriceFromApi(product.pricePerSecond)
    return { ...product, pricePerSecond }
}

export const mapAllProductsFromApi = (products: Array<Project>): Array<Project> => products.map(mapProductFromApi)

export const mapProductToPostApi = (product: Project): Project => {
    const pricePerSecond = mapPriceToApi(product.pricePerSecond)
    validateApiProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(product.priceCurrency)
    return { ...product, pricePerSecond }
}

export const isPublishedProduct = (p: Project): boolean => p.state === projectStates.DEPLOYED

export const mapProductToPutApi = (product: Project): Record<string, any> => {
    // For published paid products, the some fields can only be updated on the smart contract
    if (isPaidProduct(product) && isPublishedProduct(product)) {
        const { ownerAddress, beneficiaryAddress, pricePerSecond, priceCurrency, minimumSubscriptionInSeconds, ...otherData } = product
        return otherData
    }

    const pricePerSecond = mapPriceToApi(product.pricePerSecond)
    return { ...product, pricePerSecond }
}

export const getValidId = (id: string, prefix = true): string => {
    if (!isValidHexString(id) || parseInt(id, 16) === 0) {
        throw new InvalidHexStringError(id)
    }

    return prefix ? getPrefixedHexString(id) : getUnprefixedHexString(id)
}

const urlValidator = yup.string().trim().url()
const emailValidator = yup.string().trim().email()

export const validate = (product: Project): Record<string, boolean> => {
    const invalidFields: {[key: string]: boolean}= {}
    ;['name', 'description'].forEach((field) => {
        invalidFields[field] = !product[field as keyof Project]
    })
    invalidFields.imageUrl = !product.imageUrl && !product.newImageToUpload
    invalidFields.streams = !product.streams || product.streams.length <= 0
    invalidFields.termsOfUse = !!(product.termsOfUse != null && product.termsOfUse.termsUrl)
    const isPaid = isPaidProduct(product)

    // applies only to data union
    if (isDataUnionProduct(product)) {
        invalidFields.adminFee = product.adminFee === undefined || +product.adminFee < 0 || +product.adminFee > 1
        invalidFields.beneficiaryAddress = false
    } else {
        invalidFields.beneficiaryAddress = isPaid && (!product.beneficiaryAddress || !isEthereumAddress(product.beneficiaryAddress))
        invalidFields.adminFee = false
    }

    if (isPaid) {
        invalidFields.pricePerSecond = !isPriceValid(product.pricePerSecond)
        invalidFields.pricingTokenAddress = !isEthereumAddress(product.pricingTokenAddress)
    } else {
        invalidFields.pricePerSecond = false
        invalidFields.pricingTokenAddress = false
    }

    if (product.contact) {
        ['url', 'social1', 'social2', 'social3', 'social4'].forEach((field) => {
            if (product.contact[field as keyof ContactDetails] && product.contact[field as keyof ContactDetails].length > 0) {
                invalidFields[`contact.${field}`] = !urlValidator.isValidSync(product.contact[field as keyof ContactDetails])
            } else {
                invalidFields[`contact.${field}`] = false
            }
        })

        if (product.contact.email && product.contact.email.length > 0) {
            const result = emailValidator.isValidSync(product.contact.email)
            invalidFields['contact.email'] = !result && !!product.contact.email
        } else {
            invalidFields['contact.email'] = false
        }
    }

    if (product.requiresWhitelist && (product.contact == null || product.contact.email == null || product.contact.email.length === 0)) {
        invalidFields['contact.email'] = true
    } else if (!product.requiresWhitelist) {
        invalidFields['contact.email'] = false
    }

    return invalidFields
}
