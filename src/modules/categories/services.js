// @flow
import { get } from '../../utils/api'
import type { ApiResult } from '../../flowtype/common-types'

export const getCategories = (): ApiResult => get('categories')
