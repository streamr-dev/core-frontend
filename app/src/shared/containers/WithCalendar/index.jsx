// @flow

import React, { type ComponentType } from 'react'

import Calendar from '$shared/components/Calendar'
import styles from './withCalendar.pcss'

type State = {
    open: boolean,
    date: Date,
}

const withCalendar = (WrappedComponent: ComponentType<any>) => {
    class WithCalendar extends React.Component<{}, State> {
        state = {
            open: false,
            date: new Date(),
        }

        setDate = (date: Date) => {
            this.setState({
                date,
            })
        }

        toggle = (open?: boolean) => {
            this.setState((state) => ({
                open: typeof open === 'boolean' ? open : !state.open,
            }))
        }

        render() {
            const { date, open } = this.state

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        date={date}
                        toggleCalendar={this.toggle}
                    />
                    {open && (
                        <div className={styles.wrapper}>
                            <Calendar
                                initialValue={date}
                                onChange={this.setDate}
                            />
                        </div>
                    )}
                </React.Fragment>
            )
        }
    }

    return WithCalendar
}

export default withCalendar
