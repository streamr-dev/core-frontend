// @flow

import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import { MEDIUM } from '$shared/utils/styled'
import { getAllMembers } from '$mp/modules/dataUnion/services'
import { truncate } from '$shared/utils/text'
import { fromAtto } from '$mp/utils/math'
import Text from '$ui/Text'
import SvgIcon from '$shared/components/SvgIcon'

const Container = styled.div`
    background: #FDFDFD;
    border: 1px solid #EFEFEF;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 72px 56px auto 16px;
`

const Row = styled.div`
    padding-left: 24px;
    align-items: center;
`

const Heading = styled(Row)`
    font-weight: ${MEDIUM};
    font-size: 14px;
    line-height: 18px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 32px;
    align-items: center;
    color: #323232;
    border-bottom: 1px solid #EFEFEF;
`

const TableGrid = styled(Row)`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto auto;
`

const TableHeader = styled(TableGrid)`
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 16px;
    color: #A3A3A3;
    border-bottom: 1px solid #EFEFEF;

    &:nth-child(3) {
        justify-items: center;
    }
`

const TableRows = styled.div`
    height: ${({ rowCount }) => (rowCount * 56)}px;
    overflow: auto;
`

const TableRow = styled(TableGrid)`
    font-size: 14px;
    line-height: 56px;
    color: #525252;

    &:not(:last-child) {
        border-bottom: 1px solid #EFEFEF;
    }
`

const Footer = styled.div`
    border-top: 1px solid #EFEFEF;
`
const RemoveButton = styled(Button).attrs(() => ({
    kind: 'link',
    variant: 'dark',
}))`
    visibility: hidden;
    font-size: 12px !important;
    margin: 0 16px;

    ${TableRow}:hover & {
        visibility: visible;
    }
`

const Status = styled.div`
    border-radius: 100%;
    background: ${({ status }) => {
        if (status === 'ACTIVE') {
            return '#2AC437'
        } else if (status === 'INACTIVE') {
            return '#D90C25'
        }
        return '#EFEFEF'
    }};
    height: 16px;
    width: 16px;
`

const Disabled = styled.span`
    opacity: 0.5;
`

const SearchContainer = styled.div`
    display: flex;
    margin-right: 16px;
`

const SearchIcon = styled(SvgIcon).attrs({
    name: 'search',
})`
    width: 16px;
    height: 16px;
    color: #A3A3A3;
    position: relative;
    display: flex;
    align-self: center;
    left: 24px;
`

const SearchInput = styled(Text)`
    padding-left: 32px;
`

type Props = {
    dataUnion: any,
    className?: string,
}

const ManageMembers = ({ dataUnion, className }: Props) => {
    const dataUnionId = dataUnion && dataUnion.id
    const [members, setMembers] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const load = async () => {
            if (dataUnionId) {
                // eslint-disable-next-line no-restricted-syntax
                for await (const member of getAllMembers(dataUnionId)) {
                    setMembers((prev) => [
                        ...prev,
                        member,
                    ])
                }
            }
        }
        load()
    }, [dataUnionId])

    const onSearchChange = useCallback((e) => {
        const search = e.target.value
        setSearch(search)
    }, [setSearch])

    return (
        <Container className={className}>
            <Heading>
                Manage members
                <SearchContainer>
                    <SearchIcon />
                    <SearchInput
                        onChange={onSearchChange}
                        name="search"
                        placeholder="Search for any member by ETH address"
                        autoComplete="off"
                    />
                </SearchContainer>
            </Heading>
            <TableHeader>
                <span>Address</span>
                <span>Earnings</span>
                <span>Withdrawable</span>
                <span>Status</span>
                {/* Render button to make 'auto' column work properly */}
                <RemoveButton>Remove</RemoveButton>
            </TableHeader>
            <TableRows rowCount={4}>
                {members
                    .filter((m) => ((search && search.length > 0) ? m.address.includes(search) : true))
                    .map((member) => (
                        <TableRow key={member.address}>
                            <span>{truncate(member.address)}</span>
                            {dataUnion && dataUnion.version === 2 ? (
                                <React.Fragment>
                                    <span>{fromAtto(member.totalEarnings).toFixed(3)}</span>
                                    <span>{fromAtto(member.withdrawableEarnings).toFixed(3)}</span>
                                    <Status status={member.status} />
                                    <RemoveButton>Remove</RemoveButton>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Disabled>0.000</Disabled>
                                    <Disabled>0.000</Disabled>
                                    <Status status={member.status} />
                                    <RemoveButton>Remove</RemoveButton>
                                </React.Fragment>
                            )}
                        </TableRow>
                    ))}
            </TableRows>
            <Footer />
        </Container>
    )
}

export default styled(ManageMembers)``
