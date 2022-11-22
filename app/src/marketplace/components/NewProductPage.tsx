import React, { useEffect } from 'react'
import type { Location } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import qs from 'query-string'

import { postEmptyProduct } from '$mp/modules/product/services'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import type { ProjectType } from '$mp/types/project-types'
import '$mp/types/project-types'
import useIsMounted from '$shared/hooks/useIsMounted'
import { projectTypes } from '$mp/utils/constants'
import useFailure from '$shared/hooks/useFailure'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'
import routes from '$routes'
import useNewProductMode from '../containers/ProductController/useNewProductMode'

type Props = {
    className?: string | null | undefined
    location: Location
}

const sanitizedType = (type: string | null | undefined): ProjectType => projectTypes[(type || '').toUpperCase()] || projectTypes.NORMAL

const UnstyledNewProductPage = ({ className, location: { search } }: Props) => {
    const history = useHistory()
    const isMounted = useIsMounted()
    const fail = useFailure()
    const { dataUnionAddress, chainId } = useNewProductMode()
    useEffect(() => {
        const { type } = qs.parse(search)
        const typeString = (type != null && typeof type === "string") ? type : type[0]

        postEmptyProduct(sanitizedType(typeString), chainId).then(({ id }) => {
            if (isMounted()) {
                history.replace(
                    routes.products.edit({
                        id,
                        newProduct: true,
                        dataUnionAddress,
                    }),
                )
                Activity.push({
                    action: actionTypes.CREATE,
                    resourceId: id,
                    resourceType: resourceTypes.PRODUCT,
                })
            }
        }, fail)
    }, [isMounted, search, fail, history, dataUnionAddress, chainId])
    return <LoadingIndicator className={className} loading />
}

const NewProductPage = styled(UnstyledNewProductPage)`
    position: absolute;
    top: 0;
    height: 2px;
`
export default NewProductPage
