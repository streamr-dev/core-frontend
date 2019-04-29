// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import EmptyState from '$shared/components/EmptyState'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import noResultIcon from '$shared/assets/images/search_no_result.png'
import noResultemptyStateIcon2x from '$shared/assets/images/search_no_result@2x.png'
import type { Filter } from '$userpages/flowtype/common-types'

type NoResultsViewProps = {
    onResetFilter: Function,
    filter: ?Filter,
}
type Props = NoResultsViewProps & {
    hasFilter: boolean,
}

const NoCreatedCanvasesView = () => (
    <EmptyState
        image={(
            <img
                src={emptyStateIcon}
                srcSet={`${emptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
    >
        <Translate value="userpages.canvases.noCreatedCanvases.title" />
        <Translate value="userpages.canvases.noCreatedCanvases.message" tag="small" />
    </EmptyState>
)

const NoResultsView = ({ onResetFilter }: NoResultsViewProps) => (
    <EmptyState
        image={(
            <img
                src={noResultIcon}
                srcSet={`${noResultemptyStateIcon2x} 2x`}
                alt={I18n.t('error.notFound')}
            />
        )}
        link={(
            <button
                type="button"
                className="btn btn-special"
                onClick={onResetFilter}
            >
                <Translate value="userpages.canvases.noCanvasesResult.clearFilters" />
            </button>
        )}
    >
        <Translate value="userpages.canvases.noCanvasesResult.title" />
        <Translate value="userpages.canvases.noCanvasesResult.message" tag="small" />
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
