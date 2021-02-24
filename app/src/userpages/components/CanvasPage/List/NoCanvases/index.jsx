// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import type { Filter } from '$userpages/flowtype/common-types'
import { LG } from '$shared/utils/styled'

type NoResultsViewProps = {
    onResetFilter: Function,
    filter: ?Filter,
}
type Props = NoResultsViewProps & {
    hasFilter: boolean,
}

const Message = styled(Translate)`
    && {
        display: none;

        @media (min-width: ${LG}px) {
            display: block;
        }
    }
`

const MobileMessage = styled(Translate)`
    && {
        display: block;

        @media (min-width: ${LG}px) {
            display: none;
        }
    }
`

const NoCreatedCanvasesView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt="Not found"
            />
        )}
    >
        <p>
            <Translate value="userpages.canvases.noCreatedCanvases.title" />
            <Message value="userpages.canvases.noCreatedCanvases.message" tag="small" />
            <MobileMessage value="userpages.canvases.noCreatedCanvases.messageMobile" tag="small" />
        </p>
    </EmptyState>
)

const NoResultsView = ({ onResetFilter }: NoResultsViewProps) => (
    <EmptyState
        image={(
            <img
                src={noResultIcon}
                srcSet={`${noResultemptyStateIcon2x} 2x`}
                alt="Not found"
            />
        )}
        link={(
            <Button
                kind="special"
                onClick={onResetFilter}
            >
                <Translate value="userpages.canvases.noCanvasesResult.clearFilters" />
            </Button>
        )}
    >
        <p>
            <Translate value="userpages.canvases.noCanvasesResult.title" />
            <Translate value="userpages.canvases.noCanvasesResult.message" tag="small" />
        </p>
    </EmptyState>
)

const NoCanvasesView = ({ hasFilter, ...rest }: Props) => {
    if (hasFilter) {
        return (
            <NoResultsView {...rest} />
        )
    }

    return <NoCreatedCanvasesView />
}

export default NoCanvasesView
