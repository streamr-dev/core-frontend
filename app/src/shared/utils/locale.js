// @flow

import uniq from 'lodash/uniq'
import { setLocale } from 'react-redux-i18n'

type Locale = string

export const isLocalized = (pathname: ?string, availableLocals: Array<Locale>) => (
    !!pathname && new RegExp(`/(?:${availableLocals.join('|')})(?:$|/)`).test(pathname)
)

export const localize = (pathname: ?string, locale: ?string, availableLocals: Array<Locale>) => {
    const pn = pathname || ''
    if (locale) {
        if (isLocalized(pn, availableLocals)) {
            return pn.replace(/^\/\w{2}/, `/${locale}`)
        }
        return `/${locale}${pn}`
    }
    return pn
}

export const getNavigatorLocales = (): $ReadOnlyArray<Locale> => {
    if (typeof window !== 'undefined' && window.navigator) {
        if (Array.isArray(navigator.languages)) {
            return navigator.languages
        }
        if (navigator.language) {
            return [navigator.language]
        }
    }
    return []
}

export const getLocales = (additionalLocales: ?Locale | Array<Locale>, defaultLocale: Locale = 'en'): Array<Locale> => {
    const additionalLocaleArray = []
    if (Array.isArray(additionalLocales)) {
        additionalLocaleArray.push(...additionalLocales)
    } else if (additionalLocales) {
        additionalLocaleArray.push(additionalLocales)
    }
    return uniq([
        ...additionalLocaleArray,
        ...getNavigatorLocales(),
        defaultLocale,
    ])
}

export const trimLocale = (locale: ?Locale): ?Locale => (
    locale && locale.split('-')[0]
)

export const isSupportedLocale = (locale: ?Locale, localeList: Array<Locale>): boolean => (
    !!locale && localeList.includes(locale)
)

export const getDefaultLocale = (locale: ?Locale, localeList: Array<Locale>): ?Locale => (
    getLocales(locale).find((l) => isSupportedLocale(l, localeList))
)

export const applyLocale = (store: any, locale: ?Locale, localeList: Array<Locale>, defaultLocale: string = 'en'): boolean => {
    const trimmedLocale = trimLocale(locale)
    const isSupported = isSupportedLocale(trimmedLocale, localeList)
    store.dispatch(setLocale(isSupported ? trimmedLocale : defaultLocale))
    return isSupported
}
