// @flow

import React from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'
import { saveAs } from 'file-saver'

import { get } from '$shared/utils/api'
import ModuleSubscription from '../ModuleSubscription'
import routes from '$routes'

import styles from './ExportCSV.pcss'

type Props = {
    api: any,
    moduleHash: string,
    isActive: boolean,
    className: string,
}

type State = {
    rows: ?number,
    size: ?number,
    link: ?string,
}

type CsvMessage = {
    type: string,
    rows: number,
    kilobytes: number,
    file: ?string,
}

export default class ExportCSVModule extends React.Component<Props, State> {
    state = {
        rows: undefined,
        size: undefined,
        link: undefined,
    }

    unmounted = false

    componentWillUnmount() {
        this.unmounted = true
    }

    onMessage = throttle((msg: CsvMessage) => {
        if (msg && msg.type === 'csvUpdate') {
            this.setState({
                rows: msg.rows,
                size: msg.kilobytes,
                link: msg.file,
            })
        }
    }, 250)

    downloadFile = async (filename: string) => {
        const result = await get({
            url: routes.api.canvases.downloadCsv({
                filename,
            }),
            options: {
                responseType: 'blob',
                timeout: 30000,
            },
        })
        await saveAs(result, filename)

        if (this.unmounted) {
            return
        }

        // We need to clear the download link since the file will
        // be deleted on the server after a succesful download
        this.setState({
            link: undefined,
        })
    }

    render() {
        const { rows, size, link } = this.state
        return (
            <div className={cx(this.props.className, styles.container)}>
                <ModuleSubscription
                    {...this.props}
                    isActive={this.props.isActive}
                    onMessage={this.onMessage}
                />
                {rows != null && (
                    <div className={styles.text}>Rows: {rows}</div>
                )}
                {size != null && (
                    <div className={styles.text}>Size: {size} kb</div>
                )}
                {link && (
                    <div className={styles.text}>
                        <a
                            href="#"
                            onClick={() => {
                                this.downloadFile(link)
                            }}
                        >
                            Download CSV
                        </a>
                    </div>
                )}
            </div>
        )
    }
}
