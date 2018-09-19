// @flow

import merge from 'lodash/merge'
import web3Utils from 'web3-utils'
import { showNotification } from '../modules/notifications/actions'

import { notificationIcons, searchCharMax } from './constants'

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

export const isEthereumAddress = (value: string) => web3Utils.isAddress(value)

export const validate = (schema: any, item: any, options?: Options) => schema.validate(item, merge({}, defaultOptions, options))
    .catch((ValidationError) => {
        const errors = ValidationError.inner.reduce((result, error) => ({
            ...result,
            [error.path]: error.message,
        }), {})
        throw errors
    })

export const notifyErrors = (dispatch: Function, errors: Object) => {
    Object.keys(errors).forEach((key) => dispatch(showNotification(errors[key], notificationIcons.ERROR)))
}

export const validateThunk = (schema: any, item: any, options?: Options) =>
    (dispatch: Function) => validate(schema, item, merge({}, defaultOptions, options))
        .catch((errors) => notifyErrors(dispatch, errors))

export default validateThunk
