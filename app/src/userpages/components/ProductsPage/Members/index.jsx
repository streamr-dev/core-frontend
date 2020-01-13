// @flow

import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import useJoinRequests from '$mp/modules/communityProduct/hooks/useJoinRequests'
import NoMembersView from './NoMembers'
import { isEthereumAddress } from '$mp/utils/validate'
import CommunityPending from '$mp/components/ProductPage/CommunityPending'
import { ago } from '$shared/utils/time'

import styles from './members.pcss'

const mapStatus = (state) => {
    switch (state) {
        case 'ACCEPTED':
            return StatusIcon.OK
        case 'REJECTED':
            return StatusIcon.ERROR
        case 'PENDING':
            return StatusIcon.PENDING
        default:
            return StatusIcon.INACTIVE
    }
}

const Members = () => {
    const { loadCommunityProduct } = useController()
    const product = useProduct()
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
            filters.RECENT,
            filters.ACCEPTED,
            filters.REJECTED,
            filters.PENDING,
        ]
    }, [])
    const [approving, setApproving] = useState(false)

    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)
    const { load: loadMembers, fetching: fetchingMembers, members, approve } = useJoinRequests()

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

    useEffect(() => {
        if (communityDeployed && beneficiaryAddress) {
            loadMembers(beneficiaryAddress, filter)
        }
    }, [communityDeployed, beneficiaryAddress, loadMembers, filter])

    const toggleSelect = useCallback((id) => {
        if (selection.has(id)) {
            selection.remove(id)
        } else {
            selection.add(id)
        }
    }, [selection])

    const isAnySelected = !selection.isEmpty()

    const onApprove = useCallback(async () => {
        const ids = [...selection.selection]

        setApproving(true)
        for (let index = 0; index < ids.length; index += 1) {
            // eslint-disable-next-line no-await-in-loop
            await approve(beneficiaryAddress, ids[index])
        }
        setApproving(false)
        selection.none()
    }, [beneficiaryAddress, approve, selection])

    return (
        <CoreLayout
            footer={false}
            hideNavOnDesktop
            navComponent={(
                <Header
                    {...(communityDeployed ? {
                        searchComponent: (
                            <Search
                                placeholder={I18n.t('userpages.members.filterMembers')}
                                value={(filter && filter.search) || ''}
                                onChange={setSearch}
                            />
                        ),
                        filterComponent: (
                            <Dropdown
                                title={I18n.t('userpages.filter.sortBy')}
                                onChange={setSort}
                                selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                                disabled={!communityDeployed}
                            >
                                {sortOptions.map((s) => (
                                    <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                                        {s.displayName}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        ),
                    } : {})}
                />
            )}
            loading={fetchingMembers}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.members')}`} />
            <ListContainer className={cx(styles.container, {
                [styles.containerWithSelected]: isAnySelected,
            })}
            >
                {!communityDeployed && isEthereumAddress(beneficiaryAddress) && (
                    <div className={styles.pending}>
                        <CommunityPending />
                    </div>
                )}
                {!!communityDeployed && !members && !fetchingMembers && (
                    <NoMembersView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {!!communityDeployed && members && !fetchingMembers && members.length > 0 && (
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
                                    <Translate value="userpages.members.table.lastUpdated" />
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
                                            <span className={styles.fullAddress}>{member.memberAddress}</span>
                                            <span className={styles.truncatedAddress}>
                                                {truncate(member.memberAddress, {
                                                    maxLength: 15,
                                                })}
                                            </span>
                                        </Table.Th>
                                        <Table.Td noWrap className={styles.joinColumn}>
                                            {member.dateCreated ? ago(new Date(member.dateCreated)) : '-'}
                                        </Table.Td>
                                        <Table.Td noWrap className={styles.dataColumn}>
                                            {member.lastUpdated ? ago(new Date(member.lastUpdated)) : '-'}
                                        </Table.Td>
                                        <Table.Td noWrap className={styles.statusColumn}>
                                            <StatusIcon status={mapStatus(member.state)} />
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
                            disabled={!isAnySelected || approving}
                            type="button"
                            onClick={onApprove}
                            waiting={approving}
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
