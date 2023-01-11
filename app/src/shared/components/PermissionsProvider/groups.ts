/* eslint-disable no-bitwise */
import { Operation } from './operations'
const STREAM = {
    subscriber: Operation.Subscribe,
    publisher: Operation.Publish,
    editor: Operation.Subscribe | Operation.Edit | Operation.Publish,
    owner: Operation.Edit | Operation.Delete | Operation.Publish | Operation.Subscribe | Operation.Grant,
}
const PRODUCT = {
    viewer: Operation.Get,
    owner: Operation.Get | Operation.Edit | Operation.Delete | Operation.Grant,
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
