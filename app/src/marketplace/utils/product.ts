import BN from 'bignumber.js'
import * as yup from 'yup'
import { NumberString } from '$shared/types/common-types'
import { contractCurrencies as currencies, projectStates } from '$shared/utils/constants'
import { RecursiveKeyOf } from '$utils/recursiveKeyOf'
import InvalidHexStringError from '$shared/errors/InvalidHexStringError'
import { TheGraphProject } from '$app/src/services/projects'
import { ContactDetails, Project, ProjectId, ProjectType, SmartContractProduct } from '../types/project-types'
import { ProjectState } from '../types/project-types'
import { validateSalePoint } from './validate'
import { ProjectTypeEnum, projectTypes } from './constants'
import { fromDecimals, toDecimals } from './math'
import { getPrefixedHexString, getUnprefixedHexString, isValidHexString } from './smartContract'

export const isPaidProject = (project: Project): boolean => project.type !== ProjectTypeEnum.OPEN_DATA

export const isProjectOwnedBy = (project: TheGraphProject, address: string): boolean => {
    const { canGrant = false } = project.permissions.find((p) => p.userAddress.toLowerCase() === address.toLowerCase()) || {}

    return !!canGrant
}

export const hasActiveProjectSubscription = (project: TheGraphProject, address: string): boolean => {
    const { endTimestamp = '0' } = project.subscriptions.find((s) => s.userAddress.toLowerCase() === address.toLowerCase()) || {}

    return Number.parseInt(endTimestamp, 10) * 1000 >= Date.now()
}

export const isDataUnionProject = (project: TheGraphProject): boolean => {
    if (project != null && project.metadata != null) {
        return project.metadata.isDataUnion
    }
    return false
}

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
    // TODO map the project from contract
    // const pricePerSecond = mapPriceFromApi(product.pricePerSecond)
    return { ...product}
}

export const mapAllProductsFromApi = (products: Array<Project>): Array<Project> => products.map(mapProductFromApi)

export const getValidId = (id: string, prefix = true): string => {
    if (!isValidHexString(id) || parseInt(id, 16) === 0) {
        throw new InvalidHexStringError(id)
    }

    return prefix ? getPrefixedHexString(id) : getUnprefixedHexString(id)
}

const urlValidator = yup.string().trim().url()
const emailValidator = yup.string().trim().email()

export const validate = (project: Project): Partial<Record<RecursiveKeyOf<Project>, boolean>> => {
    const invalidFields: {[key: string]: boolean}= {};
    ['name', 'description'].forEach((field) => {
        invalidFields[field] = !project[field as keyof Project]
    })
    invalidFields.imageUrl = !project.imageUrl && !project.newImageToUpload
    invalidFields.streams = !project.streams || project.streams.length <= 0

    if (!project.creator || project.creator.length > 256) {
        invalidFields.creator = true
    }

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
        invalidFields.dataUnionChainId = !project.dataUnionChainId
    }

    // applies to paid projects and data unions
    if ([ProjectTypeEnum.PAID_DATA, ProjectTypeEnum.DATA_UNION].includes(project.type)) {
        if (!project?.salePoints || !Object.values(project?.salePoints || {}).length) {
            invalidFields.salePoints = true
        }
        if (Object.keys(project?.salePoints || {}).length) {
            Object.keys(project?.salePoints || {}).forEach((chainName) => {
                const salePoint = project.salePoints[chainName]
                const invalidSalePointFields = validateSalePoint(salePoint, project.type === ProjectTypeEnum.DATA_UNION)
                if (!!invalidSalePointFields && invalidSalePointFields.length) {
                    invalidSalePointFields.forEach((field) => {
                        invalidFields[`salePoints.${chainName}.${field}`] = true
                    })
                }
            })
        }
    }
    return invalidFields
}
