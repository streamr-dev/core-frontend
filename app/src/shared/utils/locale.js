// @flow

import uniq from 'lodash/uniq'
import type { Locale } from '$app/src/marketplace/modules/locale/types'

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

export const getNavigatorLocales = (): Array<Locale> => {
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
