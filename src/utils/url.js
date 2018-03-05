// @flow

import path from 'path'

export const formatPath = (...args: Array<string | number>): string => {
    return path.join.apply(null, ['/', ...args.map(arg => arg.toString())])
}

export const formatUrl = (...args: Array<string | number>): string => {
    const rootUrl = process.env.MARKETPLACE_API_URL.replace(/\/+$/, '')
    return `${rootUrl}${formatPath.apply(null, args)}`
}

export type QueryParams = {
    [string]: any,
}

export const queryString = (params: QueryParams): string => {
    return Object.keys(params)
        .map((k: string) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
}
