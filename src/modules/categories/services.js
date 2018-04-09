// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { Category } from '../../flowtype/category-types'

export const getCategories = (): ApiResult<Array<Category>> => get(formatUrl('categories'))
