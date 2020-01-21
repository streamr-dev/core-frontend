// @flow

import type { PayloadAction } from '$shared/flowtype/common-types'

export type UpdateEntitiesParam = {
    entities: {
        products?: {},
        contractProducts?: {},
        communityProducts?: {},
        relatedProducts?: {},
        subscriptions?: {},
        categories?: {},
        streams?: {},
        transactions?: {},
        dashboards?: {},
        integrationKeys?: {},
        resourceKeys?: {},
        joinRequests: {},
    }
}

export type UpdateEntitiesAction = PayloadAction<UpdateEntitiesParam>

export type UpdateEntitiesActionCreator = (UpdateEntitiesParam) => UpdateEntitiesAction
