// @flow

import React from 'react'
import Skeleton from 'react-loading-skeleton'

import ProductContainer from '$shared/components/Container/Product'

import CollapsedText from '$mp/components/ProductPage/CollapsedText'

import styles from './description.pcss'

type SidebarEntry = {
    title: string,
    loading?: boolean,
    value?: any,
}

type SidebarEntries = {
    [string]: SidebarEntry,
}

type Props = {
    description: string,
    sidebar?: SidebarEntries,
}

const Description = ({ description, sidebar }: Props) => (
    <div className={styles.container}>
        <ProductContainer>
            <div className={styles.separator} />
            <div className={styles.additionalInfo}>
                <CollapsedText text={description} className={styles.description} />
                <div className={styles.info}>
                    {sidebar && Object.keys(sidebar).map((id) => {
                        const { title, loading, value } = sidebar[id]

                        return (
                            <div key={id}>
                                <div className={styles.subheading}>{title}</div>
                                {!loading ? (
                                    <div>{value}</div>
                                ) : <Skeleton />}
                            </div>
                        )
                    })}
                </div>
            </div>
        </ProductContainer>
    </div>
)

export default Description
