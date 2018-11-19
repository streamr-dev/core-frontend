// @flow

import React from 'react'
import DatePicker from '$shared/components/DatePicker'

type Props = {
    date?: Date,
}

type State = {
    date: ?Date,
}

class DatePickerExample extends React.Component<Props, State> {
    state = {
        date: this.props.date,
    }

    render() {
        return (
            <DatePicker
                label="Date"
                openOnFocus
                onChange={(date) => {
                    this.setState({
                        date,
                    })
                }}
                value={this.state.date}
                placeholder="Select date…"
                {...this.props}
            />
        )
    }
}

export default DatePickerExample
