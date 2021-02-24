import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

import { REGULAR, SANS, MD, XL } from '$shared/utils/styled'

const Title = styled.h6`
    color: #525252;
    font-size: 12px;
    font-weight: ${REGULAR};
    line-height: 1em;
    white-space: nowrap;
`

const Value = styled.div`
    font-size: 20px;
    font-weight: 200;
    letter-spacing: -0.6px;
    line-height: 1em;
    white-space: nowrap;

    @media (min-width: ${MD}px) {
        font-size: 32px;
        letter-spacing: -0.67px;
    }
`

const Unit = styled.span`
    color: #525252;
    font-size: 12px;
    font-weight: ${REGULAR};
    line-height: 1em;
    letter-spacing: 0;
    margin-left: 0.4em;
`

const statLabels = {
    revenue: 'Total product revenue',
    members: 'Active Members',
    averageRevenue: 'Avg rev member / month',
    subscribers: 'Subscribers',
    revenueShare: 'Revenue share',
    created: 'Product created',
    membersGraph: 'Members',
    adminFee: 'Admin fee',
}

const UnstyledList = ({ items, ...props }) => (
    <div {...props}>
        {items.map(({ id, ...item }) => (
            <ProductStat
                {...item}
                key={id}
                title={!!id && statLabels[id]}
            />
        ))}
    </div>
)

const List = styled(UnstyledList)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 3em;
    grid-row-gap: 2em;

    @media (min-width: ${MD}px) {
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 1em;
    }

    @media (min-width: ${XL}px) {
        grid-template-columns: repeat(6, 1fr);
    }
`

const UnstyledProductStat = ({
    loading,
    title,
    value,
    unit,
    ...props
}) => (
    <div {...props}>
        <Title>{title || null}&zwnj;</Title>
        <Value>
            {!loading ? (
                <React.Fragment>
                    {value}
                    <Unit>{unit || null}</Unit>
                </React.Fragment>
            ) : (
                <Skeleton />
            )}
        </Value>
    </div>
)

const ProductStat = styled(UnstyledProductStat)`
    font-family: ${SANS};

    /* TODO: Drop. Use our skeleton! */
    & .react-loading-skeleton {
      height: 32px;
    }

    ${Title} {
        margin-bottom: 1em;
    }
`

Object.assign(ProductStat, {
    List,
    Title,
    Unit,
    Value,
})

export default ProductStat
