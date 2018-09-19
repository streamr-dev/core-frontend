// @flow

import isObject from 'lodash/isObject'
import queryString from 'query-string'
import { I18n } from '@streamr/streamr-layout'

/**
 * Filter out objects, stringify others
 * @param args URL parts, incl. strings, numbers, and/or objects
 */
const getUrlParts = (args: Array<string | number | Object>): Array<string> => (
    args.filter((arg) => !isObject(arg)).map((arg) => arg.toString())
)

/**
 * Filters out non-object URL parts and merges the rest together.
 * @param args URL parts
 * @returns {object} query params
 */
const getQuery = (args: Array<string | number | Object>): Object => (
    args.filter(isObject).reduce((memo, obj: any) => ({
        ...memo,
        ...obj,
    }), {})
)

/**
 * Turns URL parts into a query string.
 * @param args URL parts, incl. strings, numbers, and/or objects
 * @returns {string} Query string
 */
const getQueryString = (args: Array<string | number | Object>): string => {
    const query = getQuery(args)
    delete query.locale
    delete query.skipLocale
    return queryString.stringify(query)
}

/**
 * Joins URL parts and removes extra slashes
 * @param args An array of strings
 * @returns {string} Nicely joined parts
 */
const joinUrlParts = (args: Array<string>) => args.map((p) => p.replace(/^\/|\/$/g, '')).join('/')

/**
 * Determines if a locale param should be skipped in the URL.
 * @param {string} locale
 * @returns {boolean}
 */
const isSkippableLocale = (locale: string): boolean => locale === 'en' || locale === 'id'

/**
 * Formats a path that can be given for react-router (without the base url)
 * @param args url parts
 * @returns {string} path
 */
export const formatPath = (...args: Array<string | number | Object>): string => {
    const query = getQuery(args)
    const lang = query.locale || I18n.t('language.id')
    const localePart = !isSkippableLocale(lang) && !query.skipLocale ? {
        lang,
    } : {}
    const queryStr = getQueryString([localePart, ...args])
    const urlParts = getUrlParts(args)

    const stringQuery = queryStr ? `?${queryStr}` : ''
    const uri = joinUrlParts(urlParts).replace(/^\/+$/g, '') // remove multiple consecutive occurences of '/'
    return `/${uri}${stringQuery}`
}

/**
 * Formats a full URL to an API endpoint, including pathname and queries.
 * @param {*} args URL parts
 * @returns {string} Api endpoint URL
 */
export const formatApiUrl = (...args: Array<string | number | Object>): string => {
    const rootUrl = process.env.STREAMR_API_URL.replace(/\/+$/, '')
    return `${rootUrl}${formatPath(...[{
        skipLocale: true,
    }, ...args])}`
}

/**
 * Replaces multiple occurrences of slashes in path with single slashes. If there is a protocol defined,
 * slashes are removed only after that
 * @param uri path
 * @returns {string} path
 */
export const escapeExternalUrl = (uri: string) => {
    const protocol = '://'
    const pos = uri.indexOf(protocol)

    if (pos > 0) {
        return uri.substring(0, pos + protocol.length) + uri.substring(pos + protocol.length).replace(/\/+/g, '/')
    }

    return uri.replace(/\/+/g, '/')
}

export const formatExternalUrl = (...args: Array<string | number | Object>): string => {
    const query = getQueryString(args)
    const urlParts = getUrlParts(args)
    const stringQuery = query ? `?${query}` : ''
    const uri = escapeExternalUrl(urlParts.length > 1 ? joinUrlParts(urlParts) : urlParts[0])
    return `${uri}${stringQuery}`
}
