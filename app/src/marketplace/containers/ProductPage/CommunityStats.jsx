// @flow

import React from 'react'
import { useSelector } from 'react-redux'
import Skeleton from 'react-loading-skeleton'

import useProduct from '$mp/containers/ProductController/useProduct'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import usePending from '$shared/hooks/usePending'
import ProductContainer from '$shared/components/Container/Product'
import { ago } from '$shared/utils/time'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import { isCommunityProduct } from '../../utils/product'
import { getAdminFee, getJoinPartStreamId } from '$mp/modules/communityProduct/services'

import ProductOverview from '$mp/components/ProductPage/ProductOverview'

import styles from './description.pcss'

const CommunityStats = () => {
    const product = useProduct()
    const contractProduct = useContractProduct()
    const authApiKeyId = useSelector(selectAuthApiKeyId)
    const { subscriberCount } = contractProduct || {}
    const { adminFee } = product || {}
    const joinPartStreamId = 'asd'

    /* const loadCPData = useCallback(async (p) => {
        if (isCommunityProduct(p) && p.beneficiaryAddress) {
            setAdminFee(await getAdminFee(p.beneficiaryAddress))
            setJoinPartStreamId(await getJoinPartStreamId(p.beneficiaryAddress))
        }
    }, [])

    useEffect(() => {
        loadCPData(product)
    }, [product, loadCPData])
    */

    return (
        <ProductContainer>
            <ProductOverview
                product={product}
                authApiKeyId={authApiKeyId}
                adminFee={adminFee || 0}
                subscriberCount={subscriberCount || 0}
                joinPartStreamId={joinPartStreamId}
            />
        </ProductContainer>
    )
}

export default CommunityStats
