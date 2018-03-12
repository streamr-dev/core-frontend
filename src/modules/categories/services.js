// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'

export const getCategories = (): ApiResult => get(formatUrl('categories'))
