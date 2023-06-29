import { format } from 'date-fns'

export const formatShortDate = (value: number): string => {
    return format(new Date(value), 'dd MMM')
}

export const formatLongDate = (value: number): string => {
    return format(new Date(value), 'dd/mm/yyyy')
}
