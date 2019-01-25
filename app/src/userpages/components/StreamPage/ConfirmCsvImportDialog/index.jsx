// @flow

import React, { Component } from 'react'
import { I18n } from 'react-redux-i18n'

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
    onConfirm: (format: string, timestampColumnIndex: number) => void,
    errorMessage: ?string,
}

type State = {
    dateFormat: ?string,
    timestampColumnIndex: number,
    customFormat: string,
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
        name: 'Java timestamp',
        format: 'unix',
        helpText: 'Milliseconds since January 1st 1970 UTC',
    },
    UNIX_S: {
        name: 'Unix timestamp',
        format: 'unix-s',
        helpText: 'Seconds since January 1st 1970 UTC',
    },
    CUSTOM: {
        name: 'Custom Java SimpleDateFormat',
    },
})

export class ConfirmCsvImportView extends Component<Props, State> {
    state = {
        dateFormat: 'EU',
        timestampColumnIndex: 0,
        customFormat: '',
    }

    onConfirm = () => {
        const { onConfirm } = this.props
        const { dateFormat, timestampColumnIndex, customFormat } = this.state
        let formatString = (dateFormat && getDateFormats()[dateFormat].format) || null

        if (dateFormat === 'CUSTOM') {
            formatString = customFormat
        }

        if (formatString) {
            onConfirm(formatString, timestampColumnIndex)
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
        const { timestampColumnIndex, dateFormat, customFormat } = this.state
        const headers = (csvUploadState && csvUploadState.schema && csvUploadState.schema.headers) || []
        const dateFormats = getDateFormats()

        return (
            <Modal>
                <Dialog
                    title="Clarify the CSV file fields"
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
                        },
                    }}
                >
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <span className={styles.label}>Select the Timestamp column</span>
                            <Dropdown
                                className={styles.dropdown}
                                title=""
                                onChange={this.onTimestampColumnIndexChange}
                                defaultSelectedItem={timestampColumnIndex.toString()}
                            >
                                {headers.map((header, index) => (
                                    <Dropdown.Item key={header} value={index.toString()}>
                                        {header}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        </div>

                        <div className={styles.row}>
                            <span className={styles.label}>Date format</span>
                            <Dropdown
                                className={styles.dropdown}
                                title=""
                                onChange={this.onDateFormatChange}
                                defaultSelectedItem={dateFormat}
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
                                label="Enter custom format"
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
