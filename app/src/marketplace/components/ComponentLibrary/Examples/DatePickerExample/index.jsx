// @flow

import React from 'react'
import DatePicker from '$shared/components/DatePicker'

type State = {
    date: ?Date,
}

class DatePickerExample extends React.Component<{}, State> {
    state = {
        date: null,
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
            />
        )
    }
}

export default DatePickerExample
