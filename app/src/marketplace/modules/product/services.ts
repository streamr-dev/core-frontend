import { get} from '$shared/utils/api'
import type { SmartContractCall } from '$shared/types/web3-types'
import {
    marketplaceContract,
} from '$mp/utils/web3'
import type { ApiResult } from '$shared/types/common-types'
import type { Project, ProjectId, Subscription} from '$mp/types/project-types'
import { getValidId, mapProductFromApi } from '$mp/utils/product'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import routes from '$routes'
import { call } from '../../utils/smartContract'

export const getProductById = async (id: ProjectId): ApiResult<Project> =>
    get({
        url: routes.api.products.show({
            id: getValidId(id, false),
        })
    }).then(mapProductFromApi)

export const getMyProductSubscription = (id: ProjectId, chainId: number): SmartContractCall<Subscription> =>
    Promise.all([getProductFromContract(id, true, chainId), getDefaultWeb3Account()])
        .then(([, account]) => call(marketplaceContract(true, chainId).methods.getSubscription(getValidId(id), account)))
        .then(({ endTimestamp }: { endTimestamp: string }) => ({
            productId: id,
            endTimestamp: parseInt(endTimestamp, 10),
        }))

