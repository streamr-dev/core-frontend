// @flow

import React, { Fragment, Component } from 'react'

import type { IntegrationKey } from '../../../../flowtype/integration-key-types'
import IntegrationKeyList from './IntegrationKeyList'

import type { Props as ListProps } from './IntegrationKeyList'

type GivenProps = {
    className?: string,
    name?: $ElementType<IntegrationKey, 'name'>,
    hideValues?: boolean,
}

type Props = ListProps & GivenProps

export default class IntegrationKeyHandlerSegment extends Component<Props> {
    static defaultProps = {
        showInput: true,
    }

    render() {
        const { hideValues, integrationKeys, onDelete } = this.props

        return (
            <Fragment>
                <IntegrationKeyList
                    hideValues={hideValues}
                    integrationKeys={integrationKeys}
                    onDelete={onDelete}
                />
            </Fragment>
        )
    }
}
