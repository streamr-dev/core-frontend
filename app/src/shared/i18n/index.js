// @flow

import merge from 'lodash/merge'
import pick from 'lodash/pick'
import marketplaceI18n from '$mp/i18n'
import editorI18n from '$editor/i18n'
import userpagesI18n from '$userpages/i18n'
import authI18n from '$auth/i18n'

import en from './en.po'
import de from './de.po'
import cn from './cn.po'
import es from './es.po'

const localI18n = {
    en,
    de,
    cn,
    es,
}

export default pick(merge(
    {},
    marketplaceI18n,
    editorI18n,
    userpagesI18n,
    authI18n,
    localI18n,
), Object.keys(localI18n))
