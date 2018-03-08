// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { StreamId } from '../../flowtype/stream-types'

export const getStreamById = (id: StreamId): ApiResult => get(formatUrl('streams', id))
