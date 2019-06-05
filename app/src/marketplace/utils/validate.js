// @flow

import merge from 'lodash/merge'
import { isAddress } from 'web3-utils'

import { searchCharMax } from './constants'

export type Options = {
    strict?: boolean,
    abortEarly?: boolean,
    stripUnknown?: boolean,
}

const defaultOptions: Options = {
    abortEarly: false,
    stripUnknown: true,
}

export const isValidSearchQuery = (value: string) => value.length <= searchCharMax

export const isEthereumAddress = (value: string) => isAddress(value)

export const validate = (schema: any, item: any, options?: Options) => schema.validate(item, merge({}, defaultOptions, options))
    .catch((ValidationError) => {
        const errors = ValidationError.inner.reduce((result, error) => ({
            ...result,
            [error.path]: error.message,
        }), {})
        throw errors
    })
