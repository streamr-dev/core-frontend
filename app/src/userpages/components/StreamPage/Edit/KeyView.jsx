// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKey } from '$shared/flowtype/resource-key-types'
import { getStreamResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectOpenStreamId, selectOpenStreamResourceKeys } from '$userpages/modules/userPageStreams/selectors'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import Button from '$shared/components/Button'

import PermissionKeyField from './PermissionKeyField'

type OwnProps = {
    disabled: boolean,
}

type StateProps = {
    streamId: ?StreamId,
    keys: Array<ResourceKey>
}

type DispatchProps = {
    getKeys: (streamId: StreamId) => void,
}

type Props = DispatchProps & OwnProps & StateProps

const Description = styled(Translate)`
    max-width: 660px;
    margin-bottom: 3.125rem;

    a {
        text-decoration: none;
    }
`

const ListWrapper = styled.div`
    &:not(:empty) {
        margin-bottom: 2rem;
    }

    &:empty {
        display: block;
        margin-top: -1rem;
    }
`

const ListItem = styled(PermissionKeyField)`
    & + & {
        margin-top: 1.5rem;
    }
`

export class KeyView extends Component<Props> {
    mounted: boolean = false

    getKeysRequestCount = 0

    componentDidMount() {
        this.mounted = true
        this.getKeys()
    }

    componentDidUpdate(prevProps: Props) {
        // get keys if streamId/disabled changes
        if (prevProps.streamId !== this.props.streamId || prevProps.disabled !== this.props.disabled) {
            this.getKeys()
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    getKeys = async () => {
        const { disabled, streamId, getKeys } = this.props

        this.getKeysRequestCount += 1

        if (disabled || streamId == null) { return }

        const numRequests = this.getKeysRequestCount

        try {
            await getKeys(streamId)
        } catch (error) {
            if (this.mounted && numRequests === this.getKeysRequestCount) {
                Notification.push({
                    title: 'Loading keys failed.',
                    icon: NotificationIcon.ERROR,
                    error,
                })
            }
        }
    }

    render() {
        const keys = this.props.keys || []
        return (
            <Fragment>
                <Description
                    value="userpages.streams.edit.apiCredentials.description"
                    dangerousHTML
                    tag="p"
                />
                <ListWrapper>
                    {keys.map((key: ResourceKey, index: number) => (
                        <ListItem
                            key={key.id}
                            keyName={key.name}
                            value={key.id}
                            hideValue
                            showPermissionHeader={!index}
                            permission={key.permission}
                        />
                    ))}
                </ListWrapper>
                <Button kind="secondary" disabled>
                    {I18n.t('userpages.profilePage.apiCredentials.addAPIKey')}
                </Button>
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    streamId: selectOpenStreamId(state),
    keys: selectOpenStreamResourceKeys(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys(streamId: StreamId) {
        return dispatch(getStreamResourceKeys(streamId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyView)
