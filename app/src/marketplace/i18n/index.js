// @flow

import merge from 'lodash/merge'
import pick from 'lodash/pick'
import sharedI18n from '$shared/i18n'
import userpagesI18n from '$userpages/i18n'

import en from './en.po'

const localI18n = {
    en,
}

export default merge(
    {},
    pick(sharedI18n, Object.keys(localI18n)),
    pick(userpagesI18n, Object.keys(localI18n)),
    localI18n,
)
