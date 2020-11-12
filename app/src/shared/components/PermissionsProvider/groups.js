/* eslint-disable no-bitwise */

import { count } from './packer'
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

const ALL_GROUPS = {
    CANVAS,
    DASHBOARD,
    PRODUCT,
    STREAM,
}

export const NAMES = {
    CANVAS: Object.keys(CANVAS),
    DASHBOARD: Object.keys(DASHBOARD),
    PRODUCT: Object.keys(PRODUCT),
    STREAM: Object.keys(STREAM),
}

const DEFAULTS_KEYS = {
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

export const identify = (resourceType, combination) => (
    Object.entries(ALL_GROUPS[resourceType]).reduce((memo, [group, groupCombination]) => (
        count(combination & groupCombination) >= count(groupCombination) ? group : memo
    ), DEFAULTS_KEYS[resourceType])
)

export default ALL_GROUPS
