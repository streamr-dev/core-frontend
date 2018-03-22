// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'

export const getStreams = (): ApiResult => get(formatUrl('streams'))
