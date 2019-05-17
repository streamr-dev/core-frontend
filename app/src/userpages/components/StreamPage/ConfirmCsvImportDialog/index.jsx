// @flow

import React, { Component } from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { CsvUploadState } from '$userpages/flowtype/states/stream-state'
import TextInput from '$shared/components/TextInput'
import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import SelectInput from '$shared/components/SelectInput'

import styles from './confirmCsvImportDialog.pcss'

type Props = {
    streamId: ?StreamId,
    csvUploadState: ?CsvUploadState,
    onClose: () => void,
    onConfirm: (format: string, timestampColumnIndex: number) => Promise<void>,
    errorMessage: ?string,
}

type DateSelector = {
    label: string,
    value: string,
}

type TimestampColumnSelector = {
    label: string,
    value: number,
}

type State = {
    dateFormat: ?string,
    dateSelector: DateSelector,
    timestampColumnSelector: TimestampColumnSelector,
    timestampColumnIndex: number,
    customFormat: string,
    fetching: boolean,
}

type DateFormat = {
    name: string,
    format?: string,
    helpText?: string,
}

export const getDateFormats = (): { [string]: DateFormat } => ({
    EU: {
        name: 'dd/MM/yyyy HH:mm:ss.SSS',
        format: 'dd/MM/yyyy HH:mm:ss.SSS',
    },
    US: {
        name: 'MM/dd/yyyy HH:mm:ss.SSS',
        format: 'MM/dd/yyyy HH:mm:ss.SSS',
    },
    UNIX: {
        name: I18n.t('userpages.streams.edit.history.confirmCsv.dateFormats.java.name'),
        format: 'unix',
        helpText: I18n.t('userpages.streams.edit.history.confirmCsv.dateFormats.java.help'),
    },
    UNIX_S: {
        name: I18n.t('userpages.streams.edit.history.confirmCsv.dateFormats.unix.name'),
        format: 'unix-s',
        helpText: I18n.t('userpages.streams.edit.history.confirmCsv.dateFormats.unix.help'),
    },
    CUSTOM: {
        name: I18n.t('userpages.streams.edit.history.confirmCsv.dateFormats.custom.name'),
        helpText: '',
    },
})

export class ConfirmCsvImportView extends Component<Props, State> {
    state = {
        dateFormat: 'EU',
        dateSelector: {
            label: 'dd/MM/yyyy HH:mm:ss.SSS',
            value: 'EU',
        },
        timestampColumnSelector: {
            label: (this.props.csvUploadState && this.props.csvUploadState.schema && this.props.csvUploadState.schema.headers[0]) || '',
            value: 0,
        },
        timestampColumnIndex: 0,
        customFormat: '',
        fetching: false,
    }

    mounted = false

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    onConfirm = async () => {
        const { onConfirm } = this.props
        const { dateFormat, timestampColumnIndex, customFormat } = this.state
        let formatString = (dateFormat && getDateFormats()[dateFormat].format) || null

        if (dateFormat === 'CUSTOM') {
            formatString = customFormat
        }

        if (formatString) {
            this.setFetching(true)
            try {
                await onConfirm(formatString, timestampColumnIndex)
            } finally {
                this.setFetching(false)
            }
        }
    }

    setFetching = (value: boolean) => {
        if (this.mounted) {
            this.setState({
                fetching: value,
            })
        }
    }

    onTimestampColumnIndexChange = (timestampColumnSelector: TimestampColumnSelector) => {
        this.setState({
            timestampColumnIndex: timestampColumnSelector.value,
            timestampColumnSelector,
        })
    }

    onDateFormatChange = (dateSelector: DateSelector) => {
        this.setState({
            dateFormat: dateSelector.value,
            dateSelector,
        })
    }

    onCustomFormatChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            customFormat: e.target.value,
        })
    }

    render() {
        const { csvUploadState, onClose } = this.props
        const {
            dateFormat,
            dateSelector,
            timestampColumnSelector,
            customFormat,
            fetching,
        } = this.state
        const headers = (csvUploadState && csvUploadState.schema && csvUploadState.schema.headers) || []
        const dateFormats = getDateFormats()

        return (
            <Modal>
                <Dialog
                    title={I18n.t('userpages.streams.edit.history.confirmCsv.title')}
                    onClose={onClose}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            outline: true,
                            onClick: onClose,
                            color: 'link',
                        },
                        confirm: {
                            title: I18n.t('modal.common.confirm'),
                            color: 'primary',
                            onClick: this.onConfirm,
                            spinner: fetching,
                        },
                    }}
                >
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <Translate value="userpages.streams.edit.history.confirmCsv.selectTimestamp" className={styles.label} />
                            <SelectInput
                                label=""
                                name=""
                                options={headers.map((header, index) => (
                                    {
                                        label: header,
                                        value: index.toString(),
                                    }
                                ))}
                                value={timestampColumnSelector || headers[0]}
                                onChange={this.onTimestampColumnIndexChange}
                                required
                                className={styles.selectInputs}
                            />
                        </div>

                        <div className={styles.row}>
                            <Translate value="userpages.streams.edit.history.confirmCsv.dateFormat" className={styles.label} />
                            <SelectInput
                                label=""
                                name=""
                                options={
                                    Object.keys(dateFormats).map((f) => {
                                        const format = dateFormats[f]
                                        return ({
                                            label: format.name,
                                            value: f,
                                        })
                                    })
                                }
                                value={dateSelector}
                                onChange={(value) => this.onDateFormatChange(value)}
                                required
                                className={styles.selectInputs}
                            />
                            {dateFormat && dateFormats[dateFormat] && (
                                <span className={styles.helpText}>
                                    {dateFormats[dateFormat].helpText}
                                </span>
                            )}
                        </div>

                        {dateFormat === 'CUSTOM' && (
                            <div className={styles.customInput}>
                                <TextInput
                                    label={I18n.t('userpages.streams.edit.history.confirmCsv.customFormat')}
                                    value={customFormat}
                                    onChange={this.onCustomFormatChange}
                                />
                            </div>
                        )}
                    </div>
                </Dialog>
            </Modal>
        )
    }
}

export default ConfirmCsvImportView
