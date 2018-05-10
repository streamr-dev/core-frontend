// @flow

import { merge } from 'lodash'
import web3Utils from 'web3-utils'
import { showNotification } from '../modules/notifications/actions'

export type Options = {
    strict?: boolean,
    abortEarly?: boolean,
    stripUnknown?: boolean,
}

const defaultOptions: Options = {
    abortEarly: false,
    stripUnknown: true,
}

export const isEthereumAddress = (value: string) => web3Utils.isAddress(value)
export default (schema: any, item: any, options?: Options) => (dispatch: Function) => schema.validate(item, merge({}, defaultOptions, options))
    .catch((ValidationError) => ValidationError.errors.forEach((error) => dispatch(showNotification(error, 'error'))))
