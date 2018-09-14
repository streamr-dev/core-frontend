// @flow

import merge from 'lodash/merge'
import pick from 'lodash/pick'
import { i18n } from '@streamr/streamr-layout'

import en from './en.po'

const localI18n = {
    en,
}

export default merge(
    {},
    pick(i18n, Object.keys(localI18n)),
    localI18n,
)
