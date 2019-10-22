import React from 'react'
import { ago } from '$shared/utils/time'
import styles from './Status.pcss'

export default class Status extends React.Component {
    componentDidMount() {
        this.periodicUpdate()
    }

    componentWillUnmount() {
        clearTimeout(this.period)
    }

    periodicUpdate() {
        clearTimeout(this.period)
        this.period = setTimeout(() => (
            this.periodicUpdate()
        ), 10000 + Math.random())
        this.forceUpdate()
    }

    render() {
        const { updated } = this.props
        return (
            <div className={styles.status} title={new Date(updated).toLocaleTimeString()}>
                Updated {ago(new Date(updated))}
            </div>
        )
    }
}

export const CannotSaveStatus = () => (
    <div className={styles.status}>
        Canvas is read-only
    </div>
)
