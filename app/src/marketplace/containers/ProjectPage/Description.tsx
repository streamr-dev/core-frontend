import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { denormalize } from 'normalizr'
import { useController } from '$mp/containers/ProductController'
import { selectEntities } from '$shared/modules/entities/selectors'
import { categorySchema } from '$shared/modules/entities/schema'
import DescriptionComponent from '$mp/components/ProductPage/Description'

const Description = () => {
    const { product } = useController()
    const entities = useSelector(selectEntities)
    const category = product && denormalize(product.category, categorySchema, entities)
    const sidebar = useMemo(
        () => ({
            category: {
                title: 'Product category',
                loading: !category,
                value: category && category.name,
            },
        }),
        [category],
    )
    return <DescriptionComponent description={product.description} sidebar={sidebar} />
}

export default Description
