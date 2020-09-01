// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectDeleteDataError, selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import Text from '$ui/Text'
import Select from '$ui/Select'
import Label from '$ui/Label'

import styles from './historyView.pcss'

type OwnProps = {
    streamId: ?StreamId,
    disabled: boolean,
}

type StateProps = {
    stream: ?Stream,
    deleteDataError: ?ErrorInUi,
}

type DispatchProps = {
    updateEditStream: (data: Stream) => void,
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    storageAmount: number,
    storageUnit: ?string,
}

export const convertFromStorageDays = (days: number) => {
    let amount = days
    let unit = 'days'

    if (days % 30 === 0) {
        amount = days / 30
        unit = 'months'
    } else if (days % 7 === 0) {
        amount = days / 7
        unit = 'weeks'
    }

    return {
        amount,
        unit,
    }
}

const convertToStorageDays = (amount: number, unit: string) => {
    if (unit === 'months') {
        return amount * 30
    } else if (unit === 'weeks') {
        return amount * 7
    }
    return amount
}

class HistoryView extends Component<Props, State> {
    state = {
        storageAmount: 0,
        storageUnit: undefined,
    }

    mounted = false

    componentDidMount() {
        this.mounted = true
        this.loadData()
    }

    componentWillUnmount() {
        this.mounted = false
    }

    async componentDidUpdate(prevProps) {
        const { streamId } = this.props
        const { streamId: prevStreamId } = prevProps

        // Load data if stream changes
        if (streamId && streamId !== prevStreamId) {
            await this.loadData()
        }
    }

    async loadData() {
        const { stream } = this.props

        if (stream) {
            const { amount, unit } = convertFromStorageDays(stream.storageDays)
            this.setState({
                storageAmount: amount,
                storageUnit: unit,
            })
        }
    }

    onStorageAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        const amount = Number(e.target.value)
        this.setState({
            storageAmount: amount,
        }, this.updateStreamStorageDays)
    }

    onStoragePeriodUnitChange = (unit: string) => {
        this.setState({
            storageUnit: unit,
        }, this.updateStreamStorageDays)
    }

    updateStreamStorageDays = () => {
        // $FlowFixMe `updateEditStream` not in OwnProps or StateProps.
        const { updateEditStream, stream } = this.props
        const { storageAmount, storageUnit } = this.state

        if (storageAmount != null && storageUnit != null) {
            updateEditStream({
                ...stream,
                storageDays: convertToStorageDays(storageAmount, storageUnit),
            })
        }
    }

    render() {
        const { storageAmount, storageUnit } = this.state
        const { stream, disabled } = this.props

        const unitOptions: Array<any> = [
            {
                value: 'days',
                label: I18n.t('shared.date.day', { count: storageAmount }),
            },
            {
                value: 'weeks',
                label: I18n.t('shared.date.week', { count: storageAmount }),
            },
            {
                value: 'months',
                label: I18n.t('shared.date.month', { count: storageAmount }),
            },
        ]

        return (
            <div className={styles.historyView}>
                {stream && stream.storageDays !== undefined &&
                    <Fragment>
                        <Label htmlFor="storageAmount">
                            {I18n.t('userpages.streams.edit.configure.historicalStoragePeriod.label')}
                        </Label>
                        <div className={styles.storageContainer}>
                            <Text
                                id="storageAmount"
                                className={styles.storageAmount}
                                value={storageAmount}
                                onChange={this.onStorageAmountChange}
                                disabled={disabled}
                                name="storageAmount"
                            />
                            <Select
                                options={unitOptions}
                                value={unitOptions.find((o) => o.value === storageUnit)}
                                onChange={(o) => this.onStoragePeriodUnitChange(o.value)}
                                disabled={disabled}
                            />
                        </div>
                    </Fragment>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    deleteDataError: selectDeleteDataError(state),
    stream: selectEditedStream(state),
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
    updateEditStream: (data: Stream) => dispatch(updateEditStream(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryView)
