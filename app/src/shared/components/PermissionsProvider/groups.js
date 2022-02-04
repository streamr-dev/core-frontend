/* eslint-disable no-bitwise */

import {
    GET,
    EDIT,
    GRANT,
    PUBLISH,
    SUBSCRIBE,
    DELETE,
} from './operations'

const STREAM = {
    subscriber: SUBSCRIBE,
    publisher: PUBLISH,
    editor: SUBSCRIBE | EDIT | PUBLISH,
    owner: EDIT | DELETE | PUBLISH | SUBSCRIBE | GRANT,
}

const PRODUCT = {
    viewer: GET,
    owner: GET | EDIT | DELETE | GRANT,
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
