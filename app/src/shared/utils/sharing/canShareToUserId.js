import isValidUserId from './isValidUserId'

export default function canShareToUserId(value) {
    return isValidUserId(value) && value !== 'anonymous'
}
