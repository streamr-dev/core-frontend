// @flow

import * as yup from 'yup'
import merge from 'lodash/merge'
import BN from 'bignumber.js'
import { I18n } from 'react-redux-i18n'

import type { EditProduct } from '$mp/flowtype/product-types'
import type { PriceDialogResult } from '$mp/components/Modal/SetPriceDialog'
import { validate, isEthereumAddress, type Options } from '$mp/utils/validate'
import { isPriceValid } from '$mp/utils/price'
import { currencies, timeUnits } from '$shared/utils/constants'
import { isPublishedProduct } from '$mp/utils/product'

const addresses = () => ({
    pricePerSecond: yup.string().test(
        'pricePerSecond',
        I18n.t('validation.priceNumber'),
        isPriceValid,
    ),
    ownerAddress: yup.string().nullable().when('pricePerSecond', (pricePerSecond, schema) =>
        (BN(pricePerSecond).isGreaterThan(0) ? schema.required().test(
            'ownerAddress',
            I18n.t('validation.invalidOwnerAddress'),
            isEthereumAddress,
        ) : schema.notRequired())),
    beneficiaryAddress: yup.string().nullable().when('pricePerSecond', (pricePerSecond, schema) =>
        (BN(pricePerSecond).isGreaterThan(0) ? schema.required().test(
            'beneficiaryAddress',
            I18n.t('validation.invalidBeneficiaryAddress'),
            isEthereumAddress,
        ) : schema.notRequired())),
})

const price = () => ({
    isFree: yup.boolean().notRequired(),
    pricePerSecond: yup.string().when('isFree', (isFree, schema) =>
        schema.test(
            'pricePerSecondFreePaid',
            I18n.t('validation.productState'),
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
})

const extendedProduct = () => ({
    owner: yup.string(),
    created: yup.date(),
    updated: yup.date(),
    streams: yup.array().of(yup.string()).min(1, I18n.t('validation.productStreams')),
})

const editProduct = () => ({
    id: yup.string().nullable(),
    name: yup.string().required(I18n.t('validation.productName')),
    description: yup.string().required(I18n.t('validation.productDescription')),
    category: yup.string().nullable().required(I18n.t('validation.productCategory')),
    streams: yup.array().of(yup.string()),
    state: yup.string(),
    imageUrl: yup.string(),
})

const priceDialogSchema = () => yup.object(merge({}, addresses(), price())).from('amount', 'pricePerSecond', true)
const editProductSchema = () => yup.object(merge({}, editProduct(), addresses(), price(), extendedProduct()))
const createProductSchema = () => yup.object(editProduct())

export const priceDialogValidator = (p: PriceDialogResult, options?: Options) => validate(priceDialogSchema(), p, merge({}, {
    stripUnknown: false,
}, options))

const publishedProductValidator = (p: EditProduct, options?: Options) => validate(editProductSchema(), p, options)
const unpublishedProductValidator = (p: EditProduct, options?: Options) => validate(createProductSchema(), p, options)
export const editProductValidator = (p: EditProduct, options?: Options) => {
    const isPublished = isPublishedProduct(p)
    const validator = isPublished ? publishedProductValidator : unpublishedProductValidator
    return validator(p, options)
}

export type PriceDialogValidator = (p: PriceDialogResult, o?: Options) => Promise<?PriceDialogResult>
export type FreeOrPaidDeployedProductValidator = (p: EditProduct, o?: Options) => Promise<?EditProduct>
