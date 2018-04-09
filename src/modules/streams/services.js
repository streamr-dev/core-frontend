// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { Stream } from '../../flowtype/stream-types'

export const getStreams = (): ApiResult<Array<Stream>> => get(formatUrl('streams'))
