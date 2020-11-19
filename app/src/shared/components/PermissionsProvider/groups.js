/* eslint-disable no-bitwise */

import {
    GET,
    EDIT,
    SHARE,
    INTERACT,
    STARTSTOP,
    PUBLISH,
    SUBSCRIBE,
    DELETE,
} from './operations'

const CANVAS = {
    user: GET | INTERACT,
    editor: GET | EDIT | INTERACT | STARTSTOP,
    owner: GET | EDIT | DELETE | STARTSTOP | INTERACT | SHARE,
}

const STREAM = {
    subscriber: GET | SUBSCRIBE,
    publisher: GET | PUBLISH,
    editor: GET | SUBSCRIBE | EDIT | PUBLISH,
    owner: GET | EDIT | DELETE | PUBLISH | SUBSCRIBE | SHARE,
}

const DASHBOARD = {
    user: GET | INTERACT,
    editor: GET | EDIT | INTERACT,
    owner: GET | EDIT | DELETE | INTERACT | SHARE,
}

const PRODUCT = {
    viewer: GET,
    owner: GET | EDIT | DELETE | SHARE,
}

export const DEFAULTS_KEYS = {
    CANVAS: 'user',
    DASHBOARD: 'user',
    PRODUCT: 'viewer',
    STREAM: 'subscriber',
}

export const DEFAULTS = {
    CANVAS: CANVAS[DEFAULTS_KEYS.CANVAS],
    DASHBOARD: DASHBOARD[DEFAULTS_KEYS.DASHBOARD],
    PRODUCT: PRODUCT[DEFAULTS_KEYS.PRODUCT],
    STREAM: STREAM[DEFAULTS_KEYS.STREAM],
}

export default {
    CANVAS,
    DASHBOARD,
    PRODUCT,
    STREAM,
}
