// @flow

import type { PayloadAction } from '$shared/flowtype/common-types'

export type UpdateEntitiesParam = {
    entities: {
        products?: {},
        contractProducts?: {},
        dataUnions?: {},
        relatedProducts?: {},
        subscriptions?: {},
        categories?: {},
        streams?: {},
        transactions?: {},
        dashboards?: {},
        integrationKeys?: {},
        joinRequests: {},
    }
}

export type UpdateEntitiesAction = PayloadAction<UpdateEntitiesParam>

export type UpdateEntitiesActionCreator = (UpdateEntitiesParam) => UpdateEntitiesAction
