// @flow

import yup from 'yup'
import merge from 'lodash/merge'
import BN from 'bignumber.js'
import type { Product, EditProduct } from '../flowtype/product-types'
import type { PriceDialogResult } from '../components/Modal/SetPriceDialog'
import validateThunk, { validate, isEthereumAddress, type Options } from '../utils/validate'
import { currencies, timeUnits } from '../utils/constants'
import { isPaidAndNotPublishedProduct } from '../utils/product'

export const isPriceValid = (value: string) => {
    const bn = BN(value)
    return !bn.isNaN() && bn.isPositive()
}

const Addresses = {
    pricePerSecond: yup.string().test(
        'pricePerSecond',
        'Price is a number',
        isPriceValid,
    ),
    ownerAddress: yup.string().nullable().when('pricePerSecond', (pricePerSecond, schema) =>
        (BN(pricePerSecond).isGreaterThan(0) ? schema.required().test(
            'ownerAddress',
            'Owner address is not valid ethereum address',
            isEthereumAddress,
        ) : schema.notRequired())),
    beneficiaryAddress: yup.string().nullable().when('pricePerSecond', (pricePerSecond, schema) =>
        (BN(pricePerSecond).isGreaterThan(0) ? schema.required().test(
            'beneficiaryAddress',
            'Beneficiary address is not a valid ethereum address',
            isEthereumAddress,
        ) : schema.notRequired())),
}

const price = {
    isFree: yup.boolean().notRequired(),
    pricePerSecond: yup.string().when('isFree', (isFree, schema) =>
        schema.test(
            'pricePerSecondFreePaid',
            'Product state (from free to paid and vise versa) cannot be changed',
            (value) => {
                if (isFree === undefined) {
                    return BN(value).isGreaterThanOrEqualTo(0)
                }
                return isFree !== false
                    ? BN(value).isEqualTo(0)
                    : BN(value).isGreaterThan(0)
            },
        )),
    priceCurrency: yup.string().nullable().oneOf(Object.values(currencies)),
    minimumSubscriptionInSeconds: yup.number().nullable().min(0),
    timeUnit: yup.string().oneOf(Object.values(timeUnits)),
}

const extendedProduct = {
    owner: yup.string(),
    created: yup.date(),
    updated: yup.date(),
}

const editProduct = {
    id: yup.string().nullable(),
    name: yup.string().required('Please name your product'),
    description: yup.string().required('Please add a description for the product'),
    category: yup.string().nullable().required('Please choose a category'),
    streams: yup.array().of(yup.string()).min(1, 'Add at least one stream to your product'),
    state: yup.string(),
    previewStream: yup.string().nullable().when('streams', (streams, schema) => schema.test(
        'isAvaible',
        'Preview stream must be included in streams',
        (value) => value === null || value === '' || streams.includes(value),
    )),
    previewConfigJson: yup.string(),
    imageUrl: yup.string(),
}

const productPriceSchema = yup.object(merge({}, Addresses, price))
const priceDialogSchema = yup.object(merge({}, Addresses, price)).from('amount', 'pricePerSecond', true)
const editProductSchema = yup.object(editProduct)
const createProductSchema = yup.object(merge({}, editProduct, Addresses, price, extendedProduct))

export const priceDialogValidator = (p: PriceDialogResult, options?: Options) => validate(priceDialogSchema, p, merge({}, {
    stripUnknown: false,
}, options))
export const createProductValidator = (p: Product, options?: Options) => validate(createProductSchema, p, options)

const freeOrPaidDeployedProductValidator = (p: EditProduct, options?: Options) => validate(editProductSchema, p, options)
const paidNotDeployedProductValidator = (p: EditProduct, options?: Options) => validate(createProductSchema, p, options)
export const editProductValidator = (p: EditProduct, options?: Options) => {
    const isPaidAndNotPublished = isPaidAndNotPublishedProduct(p)
    const validator = isPaidAndNotPublished ? paidNotDeployedProductValidator : freeOrPaidDeployedProductValidator
    return validator(p, options)
}

export const priceValidator = (p: any, options?: Options) => validateThunk(productPriceSchema, p, options)

export type PriceValidator = (p: mixed, options?: Options) => Promise<?mixed>
export type PriceDialogValidator = (p: PriceDialogResult, o?: Options) => Promise<?PriceDialogResult>
export type FreeOrPaidDeployedProductValidator = (p: EditProduct, o?: Options) => Promise<?EditProduct>
export type CreateProductValidator = (p: Product, o?: Options) => Promise<?Product>
