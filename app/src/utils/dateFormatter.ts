import moment from 'moment'
export default (format: string) => (date: Date | null | undefined): string => date && moment(date).format(format)
