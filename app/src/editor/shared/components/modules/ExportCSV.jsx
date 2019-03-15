// @flow

import React from 'react'
import cx from 'classnames'

import routes from '$routes'
import ModuleSubscription from '../ModuleSubscription'

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

    onMessage = (msg: CsvMessage) => {
        if (msg && msg.type === 'csvUpdate') {
            this.setState({
                rows: msg.rows,
                size: msg.kilobytes,
                link: msg.file,
            })
        }
    }

    render() {
        const { rows, size, link } = this.state
        const downloadUrl = link && routes.downloadCsv({
            file: link,
        })
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
                {downloadUrl && (
                    <div className={styles.text}>
                        <a href={downloadUrl}>Download CSV</a>
                    </div>
                )}
            </div>
        )
    }
}
