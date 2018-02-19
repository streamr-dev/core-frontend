// @flow

import type { ErrorFromApi, ErrorInUi } from '../../flowtype/common-types'

export const getData = ({data}: {
    data: any
}): any => data

export const getError = ({data, status, message}: {
    data: ?ErrorFromApi,
    status: ?number,
    message: ?string
}): ErrorInUi => ({
    message: (data && data.message) || message || 'Something went wrong',
    code: data && data.code || null,
    statusCode: status
})
