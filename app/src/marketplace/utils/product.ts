import BN from 'bignumber.js'
import * as yup from 'yup'
import type { NumberString } from '$shared/types/common-types'
import { contractCurrencies as currencies, projectStates, timeUnits } from '$shared/utils/constants'
import InvalidHexStringError from '$shared/errors/InvalidHexStringError'
import type { ContactDetails, Project, ProjectId, ProjectType, SmartContractProduct } from '../types/project-types'
import { ProjectState } from '../types/project-types'
import { isEthereumAddress } from './validate'
import { isPriceValid } from './price'
import { ProjectTypeEnum, projectTypes } from './constants'
import { fromDecimals, toDecimals } from './math'
import { getPrefixedHexString, getUnprefixedHexString, isValidHexString } from './smartContract'

export const isPaidProject = (project: Project): boolean => project.type !== ProjectTypeEnum.OPEN_DATA

export const isDataUnionProduct = (productOrProductType?: Project | ProjectType): boolean => {
    const { type } =
        typeof productOrProductType === 'string'
            ? {
                type: productOrProductType,
            }
            : (productOrProductType || {}) as Project
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
    if (isPaidProject(product) && isPublishedProduct(product)) {
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

export const validate = (project: Project): Record<string, boolean> => {
    const invalidFields: {[key: string]: boolean}= {};
    ['name', 'description'].forEach((field) => {
        invalidFields[field] = !project[field as keyof Project]
    })
    invalidFields.imageUrl = !project.imageUrl && !project.newImageToUpload
    invalidFields.streams = !project.streams || project.streams.length <= 0
    invalidFields.termsOfUse = !!(project.termsOfUse != null && project.termsOfUse.termsUrl)

    if (project.contact) {
        ['url', 'social1', 'social2', 'social3', 'social4'].forEach((field) => {
            if (project.contact[field as keyof ContactDetails] && project.contact[field as keyof ContactDetails].length > 0) {
                invalidFields[`contact.${field}`] = !urlValidator.isValidSync(project.contact[field as keyof ContactDetails])
            }
        })

        if (project.contact.email && project.contact.email.length > 0) {
            const result = emailValidator.isValidSync(project.contact.email)
            invalidFields['contact.email'] = !result && !!project.contact.email
        }
    }

    // applies only to data union
    if (project.type === ProjectTypeEnum.DATA_UNION) {
        invalidFields.adminFee = project.adminFee === undefined || +project.adminFee < 0 || +project.adminFee > 1
        invalidFields.beneficiaryAddress = false
        invalidFields.pricePerSecond = !isPriceValid(project.pricePerSecond)
        invalidFields.pricingTokenAddress = !isEthereumAddress(project.pricingTokenAddress)
    }

    // applies only to paid projects
    if (project.type === ProjectTypeEnum.PAID_DATA) {
        if (!project?.salePoints || !project?.salePoints?.length) {
            invalidFields.salePoints = true
        }
        if (project?.salePoints?.length) {
            project.salePoints.forEach((salePoint) => {
                [
                    !salePoint.priceCurrency,
                    !salePoint.pricingTokenDecimals,
                    !salePoint.timeUnit,
                    !timeUnits[salePoint.timeUnit],
                    !salePoint.beneficiaryAddress,
                    !isEthereumAddress(salePoint.beneficiaryAddress),
                    !isPriceValid(salePoint.price),
                    new BN(salePoint.price).isLessThanOrEqualTo(0),
                    !salePoint.pricingTokenAddress,
                    !isEthereumAddress(salePoint.pricingTokenAddress),
                    !salePoint.pricePerSecond,
                    !isPriceValid(salePoint.pricePerSecond),
                    !salePoint.chain
                ].forEach((failedCondition) => {
                    if (failedCondition) {
                        invalidFields.salePoints = true
                    }
                })
            })
        }
    }

    return invalidFields
}
