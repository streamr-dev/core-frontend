// @flow

import React, { Component } from 'react'

import type { IntegrationKey } from '../../../../flowtype/integration-key-types'
import IntegrationKeyList from './IntegrationKeyList'

import type { Props as ListProps } from './IntegrationKeyList'

type GivenProps = {
    className?: string,
    name?: $ElementType<IntegrationKey, 'name'>,
    hideValues?: boolean,
    truncateValues?: boolean,
}

type Props = ListProps & GivenProps

export default class IntegrationKeyHandlerSegment extends Component<Props> {
    static defaultProps = {
        showInput: true,
    }

    render() {
        const {
            hideValues,
            truncateValues,
            integrationKeys,
            onDelete,
            onEdit,
        } = this.props

        return (
            <IntegrationKeyList
                hideValues={hideValues}
                truncateValues={truncateValues}
                integrationKeys={integrationKeys}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        )
    }
}
