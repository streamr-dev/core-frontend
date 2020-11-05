import React, { useCallback, useState, useEffect } from 'react'
import { Button } from '@streamr/streamr-layout'
import styled, { css } from 'styled-components'
import Sidebar from '$shared/components/Sidebar'
import { MEDIUM } from '$shared/utils/styled'

const PER_PAGE = 10

const Buttons = styled.div`
    transform: translateX(12px);

    button {
        width: 32px;
    }
`

const Inner = styled.div`
    display: flex;

    > span {
        flex-grow: 1;
    }
`

const UnstyledArrow = ({ flip, ...props }) => (
    <svg {...props} width="14" height="8" viewBox="0 0 14 8" xmlns="http://www.w3.org/2000/svg">
        <path
            // eslint-disable-next-line max-len
            d="M0.811223 7.52969C0.51833 7.2368 0.518329 6.76193 0.811223 6.46903L6.47123 0.809025C6.76412 0.516132 7.239 0.516132 7.53189 0.809025L13.1887 6.46588C13.4816 6.75877 13.4816 7.23365 13.1887 7.52654C12.8959 7.81943 12.421 7.81943 12.1281 7.52654L7.00156 2.40002L1.87188 7.52969C1.57899 7.82259 1.10412 7.82259 0.811223 7.52969Z"
            fill="currentColor"
        />
    </svg>
)

const Arrow = styled(UnstyledArrow)`
    display: block;
    transform: rotate(-90deg);

    ${({ flip }) => !!flip && css`
        transform: rotate(90deg);
    `}
`

const subcollection = (collection, startAt) => (
    collection.slice(startAt, startAt + PER_PAGE)
)

const UnstyledPagination = ({
    collection = [],
    onPage,
    selectedUserId: selectedId,
    onUserSelect,
    ...props
}) => {
    const [page, setPage] = useState(0)

    const maxPage = Math.max(0, Math.ceil(collection.length / PER_PAGE) - 1)

    const unselect = useCallback(() => {
        if (onUserSelect) {
            onUserSelect(undefined)
        }
    }, [onUserSelect])

    const next = useCallback(() => {
        unselect()
        setPage((current) => Math.min(current + 1, maxPage))
    }, [maxPage, unselect])

    const prev = useCallback(() => {
        unselect()
        setPage((current) => Math.max(0, current - 1))
    }, [unselect])

    const from = collection.length ? 1 + (page * PER_PAGE) : 0

    const to = Math.min(PER_PAGE + (page * PER_PAGE), collection.length)

    useEffect(() => {
        if (onPage) {
            onPage(subcollection(collection, page * PER_PAGE))
        }
    }, [page, onPage, collection])

    useEffect(() => {
        if (selectedId != null) {
            const index = collection.findIndex(([id]) => id === selectedId)

            if (index !== -1) {
                setPage(Math.floor(index / PER_PAGE))
            }
        } else {
            setPage(Math.min(page, maxPage))
        }
    }, [collection, selectedId, maxPage, page])

    return maxPage > 0 && (
        <Sidebar.Container {...props}>
            <Inner>
                <span>Displaying <strong>{from}-{to}</strong> out of <strong>{collection.length}</strong></span>
                <Buttons>
                    <Button type="button" onClick={prev}>
                        <Arrow />
                    </Button>
                    <Button type="button" onClick={next}>
                        <Arrow flip />
                    </Button>
                </Buttons>
            </Inner>
        </Sidebar.Container>
    )
}

const Pagination = styled(UnstyledPagination)`
    strong {
        font-weight: ${MEDIUM};
    }
`

Object.assign(Pagination, {
    subcollection,
})

export default Pagination
