// @flow

import { createAction } from 'redux-actions'

import { UPDATE_ENTITIES } from './constants'
import type { UpdateEntitiesActionCreator } from './types'

export const updateEntities: UpdateEntitiesActionCreator = createAction(UPDATE_ENTITIES, (entities) => ({
    entities,
}))
