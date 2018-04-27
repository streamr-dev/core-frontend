// @flow

import type { PayloadAction } from '../../flowtype/common-types'

export type UpdateEntitiesParam = {
    entities: {
        products?: {},
        myProducts?: {},
        myPurchases?: {},
        categories?: {},
        streams?: {},
    }
}

export type UpdateEntitiesAction = PayloadAction<UpdateEntitiesParam>

export type UpdateEntitiesActionCreator = (UpdateEntitiesParam) => UpdateEntitiesAction
