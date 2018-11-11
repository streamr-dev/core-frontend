// @flow

import * as React from 'react'

import Calendar from '$shared/components/Calendar'
import styles from './withCalendar.pcss'

export type WithCalendarProps = {
    onChange?: (Date) => void,
    closeOnSelect?: boolean,
    disabled?: boolean,
    openOnFocus?: boolean,
}

type Props = WithCalendarProps & {
    children: React.Node | ({
        date: Date,
        toggleCalendar: () => void,
    }) => React.Node,
}

type State = {
    open: boolean,
    date: Date,
}

class WithCalendar extends React.Component<Props, State> {
    static defaultProps = {
        closeOnSelect: true,
        disabled: false,
        openOnFocus: false,
    }

    state = {
        open: false,
        date: new Date(),
    }

    componentDidMount() {
        document.addEventListener('focus', this.onFocus, true)
        document.addEventListener('mousedown', this.onMouseDown)
    }

    componentWillUnmount() {
        document.removeEventListener('focus', this.onFocus, true)
        document.removeEventListener('mousedown', this.onMouseDown)
    }

    onFocus = () => {
        const { root } = this
        const { openOnFocus } = this.props
        const { open } = this.state
        const { activeElement } = document

        if (root) {
            if (!open && openOnFocus && root.contains(activeElement)) {
                this.toggle(true)
                return
            }
            if (!root.contains(activeElement)) {
                this.toggle(false)
            }
        }
    }

    onMouseDown = (e: MouseEvent) => {
        const { root } = this
        const { target } = e

        if (root && (root === target || (target instanceof Node && !root.contains(target)))) {
            this.toggle(false)
        }
    }

    setDate = (date: Date) => {
        const { closeOnSelect, onChange } = this.props

        this.setState({
            date,
        })

        if (typeof onChange === 'function') {
            onChange(date)
        }

        if (closeOnSelect) {
            setTimeout(() => {
                this.toggle(false)
            }, 0)
        }
    }

    setRoot = (root: ?HTMLDivElement) => {
        this.root = root
    }

    root: ?HTMLDivElement

    toggle = (open?: boolean) => {
        this.setState((state) => ({
            open: typeof open === 'boolean' ? open : !state.open,
        }))
    }

    children(): React.Node {
        const {
            children,
            openOnFocus,
            closeOnSelect,
            disabled,
            onChange,
            ...props
        } = this.props
        const { date } = this.state

        if (typeof children === 'function') {
            return children({
                ...props,
                date,
                toggleCalendar: this.toggle,
            })
        }

        return children
    }

    render() {
        const { date, open } = this.state
        const { disabled } = this.props

        return (
            <div ref={this.setRoot}>
                {this.children()}
                {!disabled && open && (
                    <div className={styles.wrapper}>
                        <Calendar
                            value={date}
                            onChange={this.setDate}
                        />
                    </div>
                )}
            </div>
        )
    }
}

export default WithCalendar
