// @flow

import React, { Component } from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { CsvUploadState } from '$userpages/flowtype/states/stream-state'
import Dropdown from '$shared/components/Dropdown'
import TextInput from '$shared/components/TextInput'
import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'

import styles from './confirmCsvImportDialog.pcss'

type Props = {
    streamId: ?StreamId,
    csvUploadState: ?CsvUploadState,
    onClose: () => void,
    onConfirm: (format: string, timestampColumnIndex: number) => Promise<void>,
    errorMessage: ?string,
}

type State = {
    dateFormat: ?string,
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
        helpText: I18n.t('userpages.streams.edit.history.confirmCsv.dateFormats.unix.name'),
    },
    CUSTOM: {
        name: I18n.t('userpages.streams.edit.history.confirmCsv.dateFormats.custom.name'),
    },
})

export class ConfirmCsvImportView extends Component<Props, State> {
    state = {
        dateFormat: 'EU',
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

    onTimestampColumnIndexChange = (value: string) => {
        const index = Number.parseInt(value, 10)
        this.setState({
            timestampColumnIndex: index,
        })
    }

    onDateFormatChange = (value: string) => {
        this.setState({
            dateFormat: value,
        })
    }

    onCustomFormatChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            customFormat: e.target.value,
        })
    }

    render() {
        const { csvUploadState, onClose } = this.props
        const { timestampColumnIndex, dateFormat, customFormat, fetching } = this.state
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
                            onClick: onClose,
                            color: 'link',
                        },
                        confirm: {
                            title: I18n.t('modal.common.confirm'),
                            color: 'primary',
                            outline: true,
                            onClick: this.onConfirm,
                            spinner: fetching,
                        },
                    }}
                >
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <Translate value="userpages.streams.edit.history.confirmCsv.selectTimestamp" className={styles.label} />
                            <Dropdown
                                className={styles.dropdown}
                                title=""
                                onChange={this.onTimestampColumnIndexChange}
                                selectedItem={timestampColumnIndex.toString()}
                            >
                                {headers.map((header, index) => (
                                    <Dropdown.Item key={header} value={index.toString()}>
                                        {header}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        </div>

                        <div className={styles.row}>
                            <Translate value="userpages.streams.edit.history.confirmCsv.dateFormat" className={styles.label} />
                            <Dropdown
                                className={styles.dropdown}
                                title=""
                                onChange={this.onDateFormatChange}
                                selectedItem={dateFormat}
                            >
                                {Object.keys(dateFormats).map((f) => {
                                    const format = dateFormats[f]
                                    return (
                                        <Dropdown.Item key={f} value={f}>
                                            {format.name}
                                        </Dropdown.Item>
                                    )
                                })}
                            </Dropdown>
                            {dateFormat && dateFormats[dateFormat].helpText && (
                                <span className={styles.helpText}>
                                    {dateFormats[dateFormat].helpText}
                                </span>
                            )}
                        </div>

                        {dateFormat === 'CUSTOM' && (
                            <TextInput
                                label={I18n.t('userpages.streams.edit.history.confirmCsv.customFormat')}
                                value={customFormat}
                                onChange={this.onCustomFormatChange}
                            />
                        )}
                    </div>
                </Dialog>
            </Modal>
        )
    }
}

export default ConfirmCsvImportView
