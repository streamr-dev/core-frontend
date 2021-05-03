/* eslint-disable no-bitwise */

import {
    GET,
    EDIT,
    SHARE,
    PUBLISH,
    SUBSCRIBE,
    DELETE,
} from './operations'

const STREAM = {
    subscriber: GET | SUBSCRIBE,
    publisher: GET | PUBLISH,
    editor: GET | SUBSCRIBE | EDIT | PUBLISH,
    owner: GET | EDIT | DELETE | PUBLISH | SUBSCRIBE | SHARE,
}

const PRODUCT = {
    viewer: GET,
    owner: GET | EDIT | DELETE | SHARE,
}

export const DEFAULTS_KEYS = {
    PRODUCT: 'viewer',
    STREAM: 'subscriber',
}

export const DEFAULTS = {
    PRODUCT: PRODUCT[DEFAULTS_KEYS.PRODUCT],
    STREAM: STREAM[DEFAULTS_KEYS.STREAM],
}

export const NAMES = {
    PRODUCT: Object.keys(PRODUCT),
    STREAM: Object.keys(STREAM),
}

export default {
    PRODUCT,
    STREAM,
}
