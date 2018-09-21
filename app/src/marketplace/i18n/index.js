// @flow

import merge from 'lodash/merge'
import pick from 'lodash/pick'
import { I18n } from 'react-redux-i18n'

import en from './en.po'

const localI18n = {
    en,
}

export default merge(
    {},
    pick(i18n, Object.keys(localI18n)),
    localI18n,
)
