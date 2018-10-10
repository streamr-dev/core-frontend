// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { Stream } from '$shared/flowtype/stream-types'

export const getStreams = (): ApiResult<Array<Stream>> => get(formatApiUrl('streams', {
    uiChannel: false,
    operation: 'SHARE',
}))
