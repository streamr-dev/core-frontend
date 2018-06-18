// @flow

import { createAction } from 'redux-actions'

import type { ReduxActionCreator } from '../../flowtype/common-types'

const LOGOUT = 'LOGOUT'

export const logout: ReduxActionCreator = createAction(LOGOUT)
