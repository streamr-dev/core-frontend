// @flow

import React from 'react'
import DatePicker from '$shared/components/DatePicker'

class DatePickerExample extends React.Component<{}, {
    date: Date,
}> {
    state = {
        date: new Date('2018-01-01'),
    }

    render() {
        return (
            <DatePicker
                openOnFocus
                onChange={(date) => {
                    this.setState({
                        date,
                    })
                }}
                value={this.state.date}
                placeholder="1970-01-01"
            />
        )
    }
}

export default DatePickerExample
