// @flow

import React, { useEffect, useCallback, useMemo } from 'react'
import Helmet from 'react-helmet'
import { Translate, I18n } from 'react-redux-i18n'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'

import CoreLayout from '$shared/components/Layout/Core'
import Header from '../Header'
import ListContainer from '$shared/components/Container/List'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import Layout from '$shared/components/Layout'
import Search from '$userpages/components/Header/Search'
import Dropdown from '$shared/components/Dropdown'
import type { CommunityId } from '$mp/flowtype/product-types'
import { getFilters } from '$userpages/utils/constants'
import ProductController, { useController } from '$mp/containers/ProductController'
import usePending from '$shared/hooks/usePending'
import useProduct from '$mp/containers/ProductController/useProduct'
import useFilterSort from '$userpages/hooks/useFilterSort'
import Table from '$shared/components/Table'
import StatusIcon from '$shared/components/StatusIcon'
import Checkbox from '$shared/components/Checkbox'
import Button from '$shared/components/Button'
import { truncate } from '$shared/utils/text'
import { useSelectionContext, SelectionProvider } from '$shared/hooks/useSelection'

import NoMembersView from './NoMembers'

import styles from './members.pcss'

const all = true
const members = all ? [{
    id: '1',
    address: '0xeABE498C90fB31F6932Ab9DA9C4997a6d9f18639',
}, {
    id: '2',
    address: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
}, {
    id: '3',
    address: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
}, {
    id: '4',
    address: '0x795063367EbFEB994445d810b94461274E4f109A',
}] : []

const Members = () => {
    const { loadCommunityProduct } = useController()
    const product = useProduct()
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
            filters.RECENT,
            filters.NAME_ASC,
            filters.NAME_DESC,
        ]
    }, [])

    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)

    const loadCommunity = useCallback(async (id: CommunityId) => {
        loadCommunityProduct(id)
    }, [loadCommunityProduct])

    const { communityDeployed, beneficiaryAddress } = product

    useEffect(() => {
        if (communityDeployed && beneficiaryAddress) {
            loadCommunity(beneficiaryAddress)
        }
    }, [communityDeployed, beneficiaryAddress, loadCommunity])
    const selection = useSelectionContext()

    const toggleSelect = useCallback((id) => {
        if (selection.has(id)) {
            selection.remove(id)
        } else {
            selection.add(id)
        }
    }, [selection])

    const isAnySelected = !selection.isEmpty()

    const onApprove = useCallback(() => {
        console.log(...selection.selection)
        selection.none()
    }, [selection])

    return (
        <CoreLayout
            footer={false}
            hideNavOnDesktop
            navComponent={(
                <Header
                    searchComponent={
                        <Search
                            placeholder={I18n.t('userpages.members.filterMembers')}
                            value={(filter && filter.search) || ''}
                            onChange={setSearch}
                        />
                    }
                    filterComponent={
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
                />
            )}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.members')}`} />
            <ListContainer>
                {!members && (
                    <NoMembersView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {members && members.length > 0 && (
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    <Translate value="userpages.members.table.ethereumAddress" />
                                </th>
                                <th className={styles.joinColumn}>
                                    <Translate value="userpages.members.table.joinedRequested" />
                                </th>
                                <th className={styles.dataColumn}>
                                    <Translate value="userpages.members.table.lastData" />
                                </th>
                                <th className={styles.statusColumn}>
                                    <Translate value="userpages.members.table.status" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => {
                                const isSelected = selection.has(member.id)

                                return (
                                    <tr
                                        key={member.id}
                                        className={cx(styles.addressRow, {
                                            [styles.rowSelected]: isSelected,
                                        })}
                                        onClick={() => toggleSelect(member.id)}
                                    >
                                        <Table.Th noWrap title={member.address} className={styles.addressColumn}>
                                            <div className={styles.checkboxContainer}>
                                                <Checkbox
                                                    value={isSelected}
                                                    onChange={() => toggleSelect(member.id)}
                                                    className={styles.checkbox}
                                                />
                                            </div>
                                            <span className={styles.fullAddress}>{member.address}</span>
                                            <span className={styles.truncatedAddress}>
                                                {truncate(member.address, {
                                                    maxLength: 15,
                                                })}
                                            </span>
                                        </Table.Th>
                                        <Table.Td noWrap className={styles.joinColumn}>-</Table.Td>
                                        <Table.Td noWrap className={styles.dataColumn}>-</Table.Td>
                                        <Table.Td noWrap className={styles.statusColumn}>
                                            <StatusIcon status={StatusIcon.INACTIVE} />
                                        </Table.Td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                )}
            </ListContainer>
            <div className={cx(styles.selectedToolbar, {
                [styles.hasAnySelected]: isAnySelected,
            })}
            >
                <ListContainer className={styles.selectedToolbarInner}>
                    <div className={styles.numberOfSelected}>
                        {isAnySelected && (
                            <Translate
                                value="userpages.members.applicantsSelected"
                                count={selection.size()}
                            />
                        )}
                    </div>
                    <div className={styles.actionButtons}>
                        <Button
                            kind="link"
                            disabled={!isAnySelected}
                            type="button"
                            onClick={() => selection.none()}
                        >
                            <Translate value="userpages.members.actions.cancel" />
                        </Button>
                        <Button
                            kind="primary"
                            outline
                            disabled={!isAnySelected}
                            type="button"
                            onClick={() => selection.none()}
                        >
                            <Translate value="userpages.members.actions.deselectAll" />
                        </Button>
                        <Button
                            kind="primary"
                            disabled={!isAnySelected}
                            type="button"
                            onClick={onApprove}
                        >
                            <Translate value="userpages.members.actions.approve" />
                        </Button>
                    </div>
                </ListContainer>
            </div>
        </CoreLayout>
    )
}

const LoadingView = () => (
    <Layout nav={false}>
        <LoadingIndicator loading className={styles.loadingIndicator} />
    </Layout>
)

const MembersWrap = () => {
    const product = useProduct()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!product || loadPending || permissionsPending) {
        return <LoadingView />
    }

    const key = (!!product && product.id) || ''

    return (
        <SelectionProvider key={key}>
            <Members />
        </SelectionProvider>
    )
}

const MembersContainer = withRouter((props) => (
    <ProductController key={props.match.params.id}>
        <MembersWrap />
    </ProductController>
))

export default () => (
    <MembersContainer />
)
