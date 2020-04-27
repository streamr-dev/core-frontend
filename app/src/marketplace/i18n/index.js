// @flow

import merge from 'lodash/merge'
import pick from 'lodash/pick'
import sharedI18n from '$shared/i18n'
import userpagesI18n from '$userpages/i18n'
import authI18n from '$auth/i18n'
import editorI18n from '$editor/i18n'
import docsI18n from '$docs/i18n'

import en from './en.po'

const localI18n = {
    en,
}

export default pick(merge(
    {},
    sharedI18n,
    userpagesI18n,
    authI18n,
    editorI18n,
    localI18n,
    docsI18n,
), Object.keys(localI18n))
