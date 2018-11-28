// @flow

import { setLocale } from 'react-redux-i18n'
import { isSupportedLocale, trimLocale } from '$app/src/shared/utils/locale'
import type { Locale } from '$app/src/marketplace/modules/locale/types'

export const applyLocale = (locale: ?Locale, localeList: Array<Locale>, defaultLocale: string = 'en') => (dispatch: Function) => {
    const trimmedLocale = trimLocale(locale)
    const isSupported = isSupportedLocale(trimmedLocale, localeList)
    dispatch(setLocale(isSupported ? trimmedLocale : defaultLocale))
}
