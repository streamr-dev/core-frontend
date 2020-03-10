// @flow

import React, { useEffect, useMemo, Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import Layout from '../Layout'
import links from '../../../links'
import { getFilters } from '../../utils/constants'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import { productStates } from '$shared/utils/constants'
import Search from '../Header/Search'
import Dropdown from '$shared/components/Dropdown'
import NoProductsView from './NoProducts'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useModal from '$shared/hooks/useModal'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'
import routes from '$routes'
import CreateProductModal from '$mp/containers/CreateProductModal'
import Button from '$shared/components/Button'
import { productTypes } from '$mp/utils/constants'
import Grid from '$shared/components/Tile/Grid'
import { ProductTile } from '$shared/components/Tile'
import * as MenuItems from './MenuItems'
import { isEthereumAddress } from '$mp/utils/validate'
import { getAdminFee } from '$mp/modules/dataUnion/services'
import useIsMounted from '$shared/hooks/useIsMounted'

import styles from './products.pcss'

const CreateProductButton = () => {
    const { api: createProductDialog } = useModal('marketplace.createProduct')

    if (!process.env.NEW_MP_CONTRACT) {
        return (
            <Button
                tag={Link}
                to={links.marketplace.createProduct}
                className={styles.createProductButton}
            >
                <Translate value="userpages.products.createProduct" />
            </Button>
        )
    } else if (process.env.DATA_UNIONS) {
        return (
            <Button
                type="button"
                className={styles.createProductButton}
                onClick={() => createProductDialog.open()}
            >
                <Translate value="userpages.products.createProduct" />
            </Button>
        )
    }

    return (
        <Button
            tag={Link}
            className={styles.createProductButton}
            to={routes.newProduct({
                type: productTypes.NORMAL,
            })}
        >
            <Translate value="userpages.products.createProduct" />
        </Button>
    )
}

const Tile = ({ product, members }: any) => {
    const [isDeploying, setIsDeploying] = useState(false)

    const isMounted = useIsMounted()

    const { id, beneficiaryAddress, state } = product

    const isDataUnion = isDataUnionProduct(product.type)

    const memberCount = isDataUnion ? members[(beneficiaryAddress || '').toLowerCase()] : undefined

    const deployed = state === productStates.DEPLOYED

    const publishable = deployed || state === productStates.NOT_DEPLOYED

    useEffect(() => {
        (async () => {
            let result = false

            if (isDataUnion && isEthereumAddress(beneficiaryAddress)) {
                try {
                    result = await getAdminFee(beneficiaryAddress, true) != null
                } catch (e) {
                    // Ignore.
                }
            }

            if (isMounted()) {
                setIsDeploying(result)
            }
        })()
    }, [isDataUnion, beneficiaryAddress, isMounted])

    return (
        <ProductTile
            key={id}
            actions={
                <Fragment>
                    <MenuItems.Edit id={id} />
                    {!process.env.NEW_MP_CONTRACT && publishable && (
                        <MenuItems.PublishUnpublish id={id} deployed={deployed} />
                    )}
                    {!!process.env.NEW_MP_CONTRACT && (
                        <MenuItems.View id={id} disabled={!deployed} />
                    )}
                    {!!process.env.DATA_UNIONS && isDataUnion && (
                        <MenuItems.ViewStats id={id} />
                    )}
                    {!!process.env.DATA_UNIONS && isDataUnion && (
                        <MenuItems.ViewDataUnion id={id} />
                    )}
                    <MenuItems.Copy id={id} disabled={!deployed} />
                </Fragment>
            }
            deployed={deployed}
            numMembers={memberCount}
            product={product}
            showDataUnionBadge={isDataUnion}
            showDeployingBadge={isDeploying && typeof memberCount === 'undefined'}
        />
    )
}

const ProductsPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
            filters.RECENT,
            filters.NAME_ASC,
            filters.NAME_DESC,
            filters.PUBLISHED,
            filters.DRAFTS,
        ]
    }, [])
    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)
    const products = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()
    const { load: loadDataUnionStats, members } = useMemberStats()

    useEffect(() => {
        dispatch(getMyProducts(filter))
    }, [dispatch, filter])

    useEffect(() => {
        loadDataUnionStats()
    }, [loadDataUnionStats])

    return (
        <Layout
            headerAdditionalComponent={<CreateProductButton />}
            headerSearchComponent={
                <Search
                    placeholder={I18n.t('userpages.products.filterProducts')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <Dropdown
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                >
                    {sortOptions.map((s) => (
                        <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            }
            loading={fetching}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.products')}`} />
            <ListContainer className={styles.corepageContentContainer}>
                {!fetching && products && !products.length && (
                    <NoProductsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                <Grid>
                    {products.map((product) => (
                        <Tile key={product.id} product={product} members={members} />
                    ))}
                </Grid>
            </ListContainer>
            <DocsShortcuts />
            <CreateProductModal />
        </Layout>
    )
}

export default ProductsPage
