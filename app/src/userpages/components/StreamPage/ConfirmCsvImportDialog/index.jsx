// @flow

import React, { Component } from 'react'
import { I18n } from 'react-redux-i18n'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { CsvUploadState } from '$userpages/flowtype/states/stream-state'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Select from '$shared/components/Input/Select'
import FormControlLabel from '$shared/components/FormControlLabel'
import CoreText from '$shared/components/Input/StyledText'
import FormControlErrors from '$shared/components/FormControlErrors'

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
        const { csvUploadState, onClose, errorMessage } = this.props
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
            <ModalPortal>
                <Dialog
                    title={I18n.t('userpages.streams.edit.history.confirmCsv.title')}
                    onClose={onClose}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            onClick: onClose,
                            kind: 'link',
                        },
                        confirm: {
                            title: I18n.t('modal.common.confirm'),
                            kind: 'primary',
                            onClick: this.onConfirm,
                            spinner: fetching,
                        },
                    }}
                >
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <FormControlLabel>
                                {I18n.t('userpages.streams.edit.history.confirmCsv.selectTimestamp')}
                            </FormControlLabel>
                            <Select
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
                            />
                        </div>

                        <div className={styles.row}>
                            <FormControlLabel state={!!errorMessage && 'ERROR'}>
                                {I18n.t('userpages.streams.edit.history.confirmCsv.dateFormat')}
                            </FormControlLabel>
                            <Select
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
                            />
                            {errorMessage && (
                                <FormControlErrors>
                                    {errorMessage}
                                </FormControlErrors>
                            )}
                            {dateFormat && dateFormats[dateFormat] && (
                                <span className={styles.helpText}>
                                    {dateFormats[dateFormat].helpText}
                                </span>
                            )}
                        </div>

                        {dateFormat === 'CUSTOM' && (
                            <div className={styles.row}>
                                <FormControlLabel htmlFor="customFormat">
                                    {I18n.t('userpages.streams.edit.history.confirmCsv.customFormat')}
                                </FormControlLabel>
                                <CoreText
                                    id="customFormat"
                                    value={customFormat}
                                    onChange={this.onCustomFormatChange}
                                />
                            </div>
                        )}
                    </div>
                </Dialog>
            </ModalPortal>
        )
    }
}

export default ConfirmCsvImportView
