// @flow

import path from 'path'

export const formatPath = (...args: Array<string | number>): string => {
    return path.join.apply(null, ['/', ...args.map(arg => arg.toString())])
}

export const formatUrl = (...args: Array<string | number>): string => {
    const rootUrl = process.env.MARKETPLACE_API_URL.replace(/\/+$/, '')
    return `${rootUrl}${formatPath.apply(null, args)}`
}
