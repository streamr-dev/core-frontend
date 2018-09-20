// @flow

import type { PayloadAction } from '../../flowtype/common-types'

export type UpdateEntitiesParam = {
    entities: {
        products?: {},
        contractProducts?: {},
        relatedProducts?: {},
        subscriptions?: {},
        categories?: {},
        streams?: {},
        transactions?: {},
    }
}

export type UpdateEntitiesAction = PayloadAction<UpdateEntitiesParam>

export type UpdateEntitiesActionCreator = (UpdateEntitiesParam) => UpdateEntitiesAction
