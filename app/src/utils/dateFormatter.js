// @flow

import moment from 'moment'

export default (format: string) => (date: ?Date) => (
    date && moment(date).format(format)
)
