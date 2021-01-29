// @flow

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import { titleize } from '@streamr/streamr-layout'
import styled, { css } from 'styled-components'

import { CoreHelmet } from '$shared/components/Helmet'
import Nav from '$shared/components/Layout/Nav'
import CoreLayout from '$shared/components/Layout/Core'
import coreLayoutStyles from '$shared/components/Layout/core.pcss'
import ListContainer from '$shared/components/Container/List'
import Popover from '$shared/components/Popover'
import { getFilters } from '$userpages/utils/constants'
import ProductController, { useController } from '$mp/containers/ProductController'
import usePending from '$shared/hooks/usePending'
import useProduct from '$mp/containers/ProductController/useProduct'
import useFilterSort from '$userpages/hooks/useFilterSort'
import StatusIcon from '$shared/components/StatusIcon'
import Button from '$shared/components/Button'
import { truncate } from '$shared/utils/text'
import { useSelectionContext, SelectionProvider } from '$shared/hooks/useSelection'
import useJoinRequests from '$mp/modules/dataUnion/hooks/useJoinRequests'
import { isEthereumAddress } from '$mp/utils/validate'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import { ago } from '$shared/utils/time'
import confirmDialog from '$shared/utils/confirm'
import Search from '$userpages/components/Header/Search'
import useIsMounted from '$shared/hooks/useIsMounted'
import ResourceNotFoundError, { ResourceType } from '$shared/errors/ResourceNotFoundError'
import { isDataUnionProduct } from '$mp/utils/product'
import { MemberList } from '$shared/components/List'
import { MD, LG } from '$shared/utils/styled'
import Header from '../Header'
import NoMembersView from './NoMembers'

import styles from './members.pcss'

const FullAddress = styled.span`
    display: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const TruncatedAddress = styled.span`
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const StyledMemberRow = styled(MemberList.Row)`
    &:hover {
        ${FullAddress} {
            display: block;
        }

        ${TruncatedAddress} {
            display: none;
        }
    }

    ${({ active }) => !!active && css`
        ${FullAddress} {
            display: block;
        }

        ${TruncatedAddress} {
            display: none;
        }
    `}
`

const StyledListContainer = styled(ListContainer)`
    && {
        padding: 0;
        margin-bottom: 4em;
    }

    @media (min-width: ${MD}px) {
        && {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-bottom: 0;
        }
    }
`

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
    const { loadDataUnion } = useController()
    const product = useProduct()
    const filters = getFilters('dataunion')
    const sortOptions = useMemo(() => ([
        filters.APPROVE,
        filters.REMOVE,
        filters.REJECTED,
    ]), [filters])
    const [approving, setApproving] = useState(false)
    const [removing, setRemoving] = useState(false)
    const [search, setSearch] = useState(undefined)
    const isMounted = useIsMounted()

    const { defaultFilter, filter, setSort } = useFilterSort(sortOptions)
    const {
        load: loadMembers,
        fetching: fetchingMembers,
        members,
        approve,
        remove,
    } = useJoinRequests()
    const selection = useSelectionContext()

    const { dataUnionDeployed, beneficiaryAddress } = product

    useEffect(() => {
        if (dataUnionDeployed && beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress)
        }
    }, [dataUnionDeployed, beneficiaryAddress, loadDataUnion])

    const doLoadMembers = useCallback(() => {
        if (dataUnionDeployed && beneficiaryAddress) {
            loadMembers({
                dataUnionId: beneficiaryAddress,
                filter,
            })
        }
    }, [dataUnionDeployed, beneficiaryAddress, loadMembers, filter])
    const loadMembersRef = useRef()
    loadMembersRef.current = doLoadMembers

    useEffect(() => {
        if (loadMembersRef.current) {
            loadMembersRef.current()
        }
    }, [filter, loadMembersRef])

    const toggleSelect = useCallback((id) => {
        if (selection.has(id)) {
            selection.remove(id)
        } else {
            selection.add(id)
        }
    }, [selection])

    const isAnySelected = !selection.isEmpty()
    const areAllSelected = selection.size() === members.length

    const toggleSelectAll = useCallback(() => {
        if (!members || members.length <= 0) { return }

        if (areAllSelected) {
            selection.none()
        } else {
            members.forEach(({ id }) => selection.add(id))
        }
    }, [areAllSelected, selection, members])

    const onApprove = useCallback(async () => {
        const ids = [...selection.selection]

        setApproving(true)
        for (let index = 0; index < ids.length; index += 1) {
            // eslint-disable-next-line no-await-in-loop
            await approve({
                dataUnionId: beneficiaryAddress,
                joinRequestId: ids[index],
            })
        }

        if (!isMounted()) { return }

        setApproving(false)
        selection.none()

        if (loadMembersRef.current) {
            loadMembersRef.current()
        }
    }, [beneficiaryAddress, approve, selection, loadMembersRef, isMounted])

    const onRemove = useCallback(async () => {
        setRemoving(true)

        const confirmed = await confirmDialog('members', {
            title: I18n.t('userpages.members.confirmTitle'),
            message: (
                <Translate
                    value="userpages.members.confirmMessage"
                    dangerousHTML
                    tag="p"
                />
            ),
            acceptButton: {
                title: I18n.t('userpages.members.confirmButton'),
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: true,
        })

        if (confirmed) {
            const ids = [...selection.selection]

            for (let index = 0; index < ids.length; index += 1) {
                // eslint-disable-next-line no-await-in-loop
                await remove({
                    dataUnionId: beneficiaryAddress,
                    joinRequestId: ids[index],
                })
            }

            if (!isMounted()) { return }

            selection.none()

            if (loadMembersRef.current) {
                loadMembersRef.current()
            }
        }

        setRemoving(false)
    }, [beneficiaryAddress, remove, selection, loadMembersRef, isMounted])

    const onSortChange = useCallback((...args) => {
        // Clear selected & search on sort change
        selection.none()
        setSearch(undefined)

        setSort(...args)
    }, [selection, setSort, setSearch])

    const selectedFilterId = (filter && filter.id) || (defaultFilter && defaultFilter.id)

    const filteredMembers = useMemo(() => {
        if (!members || !search) {
            return members
        }

        return members.filter(({ memberAddress }) => {
            const searchTerm = search.trim().toLowerCase()

            return memberAddress.toLowerCase().includes(searchTerm)
        })
    }, [members, search])

    const onResetFilter = useCallback(() => {
        setSearch(undefined)

        // If there are no values hidden by search, clear also other filters
        if (members && members.length <= 0) {
            selection.none()
        }
    }, [members, selection])

    const isApprovalView = !!(selectedFilterId === filters.APPROVE.filter.id)

    return (
        <CoreLayout
            footer={false}
            nav={(
                <Nav noWide />
            )}
            navComponent={(
                <Header
                    searchComponent={dataUnionDeployed ? (
                        <Search.Active
                            placeholder={I18n.t('userpages.members.filterMembers')}
                            value={search || ''}
                            onChange={setSearch}
                        />
                    ) : (
                        <Search.Disabled />
                    )}
                    filterComponent={!!dataUnionDeployed && (
                        <Popover
                            title={I18n.t('userpages.filter.sortBy')}
                            type="uppercase"
                            activeTitle
                            menuProps={{
                                right: true,
                            }}
                            onChange={onSortChange}
                            selectedItem={selectedFilterId}
                            disabled={!dataUnionDeployed}
                        >
                            {sortOptions.map((s) => (
                                <Popover.Item key={s.filter.id} value={s.filter.id}>
                                    {s.displayName}
                                </Popover.Item>
                            ))}
                        </Popover>
                    )}
                />
            )}
            loading={fetchingMembers}
            contentClassname={coreLayoutStyles.pad}
        >
            <CoreHelmet title={I18n.t('userpages.title.members')} />
            <StyledListContainer className={cx(styles.container, {
                [styles.containerWithSelected]: isAnySelected,
            })}
            >
                {!dataUnionDeployed && isEthereumAddress(beneficiaryAddress) && (
                    <div className={styles.pending}>
                        <DataUnionPending />
                    </div>
                )}
                {!!dataUnionDeployed && !fetchingMembers && filteredMembers && !filteredMembers.length && (
                    <NoMembersView
                        hasFilter={!!search}
                        filter={filter}
                        onResetFilter={onResetFilter}
                    />
                )}
                {!!dataUnionDeployed && !fetchingMembers && filteredMembers && filteredMembers.length > 0 && (
                    <MemberList>
                        <MemberList.Header>
                            <MemberList.HeaderItem>
                                <Translate value="userpages.members.table.ethereumAddress" />
                            </MemberList.HeaderItem>
                            <MemberList.HeaderItem>
                                <Translate value="userpages.members.table.joinedRequested" />
                            </MemberList.HeaderItem>
                            <MemberList.HeaderItem>
                                <Translate value="userpages.members.table.lastUpdated" />
                            </MemberList.HeaderItem>
                            <MemberList.HeaderItem>
                                <Translate value="userpages.members.table.status" />
                            </MemberList.HeaderItem>
                        </MemberList.Header>
                        {filteredMembers.map((member) => {
                            const isSelected = selection.has(member.id)

                            return (
                                <StyledMemberRow
                                    id={member.id}
                                    key={member.id}
                                    selectable
                                    onClick={() => toggleSelect(member.id)}
                                    active={isSelected}
                                >
                                    <MemberList.Title
                                        description={member.lastUpdated ? titleize(ago(new Date(member.lastUpdated))) : '-'}
                                        moreInfo={member.dateCreated ? titleize(ago(new Date(member.dateCreated))) : '-'}
                                    >
                                        <FullAddress>{member.memberAddress}</FullAddress>
                                        <TruncatedAddress>
                                            {truncate(member.memberAddress)}
                                        </TruncatedAddress>
                                    </MemberList.Title>
                                    <MemberList.Item>
                                        {member.dateCreated ? titleize(ago(new Date(member.dateCreated))) : '-'}
                                    </MemberList.Item>
                                    <MemberList.Item>
                                        {member.lastUpdated ? titleize(ago(new Date(member.lastUpdated))) : '-'}
                                    </MemberList.Item>
                                    <MemberList.Item>
                                        <StatusIcon
                                            status={mapStatus(member.state)}
                                            tooltip={I18n.t(`userpages.members.status.${(member.state || '').toLowerCase()}`)}
                                        />
                                    </MemberList.Item>
                                </StyledMemberRow>
                            )
                        })}
                    </MemberList>
                )}
            </StyledListContainer>
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
                            kind="primary"
                            outline
                            disabled={!isAnySelected || approving}
                            type="button"
                            onClick={toggleSelectAll}
                            className={styles.selectButton}
                        >
                            <Translate value={`userpages.members.actions.${areAllSelected ? 'deselectAll' : 'selectAll'}`} />
                        </Button>
                        {isApprovalView && (
                            <Button
                                kind="primary"
                                disabled={!isAnySelected || approving}
                                type="button"
                                onClick={onApprove}
                                waiting={approving}
                                className={styles.approveButton}
                            >
                                <Translate value="userpages.members.actions.approve" />
                            </Button>
                        )}
                        {!isApprovalView && (
                            <Button
                                kind="primary"
                                disabled={!isAnySelected || removing}
                                type="button"
                                onClick={onRemove}
                                waiting={removing}
                                className={styles.approveButton}
                            >
                                <Translate value="userpages.members.actions.remove" />
                            </Button>
                        )}
                    </div>
                </ListContainer>
            </div>
        </CoreLayout>
    )
}

const LoadingView = () => (
    <CoreLayout
        footer={false}
        nav={(
            <Nav noWide />
        )}
        navComponent={(
            <Header
                searchComponent={
                    <Search.Disabled />
                }
            />
        )}
        contentClassname={cx(styles.contentArea, coreLayoutStyles.pad)}
        loading
    />
)

const MembersWrap = () => {
    const product = useProduct()
    const { hasLoaded } = useController()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!hasLoaded || loadPending || permissionsPending) {
        return <LoadingView />
    }

    // show not found if DU is not actually yet deployed
    const { id, beneficiaryAddress } = product

    if (!isDataUnionProduct(product) || !beneficiaryAddress) {
        throw new ResourceNotFoundError(ResourceType.PRODUCT, id)
    }

    const key = (!!product && id) || ''

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
