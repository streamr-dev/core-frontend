import moment from 'moment'
export default (format: string) => (date: Date | null | undefined) => date && moment(date).format(format)
