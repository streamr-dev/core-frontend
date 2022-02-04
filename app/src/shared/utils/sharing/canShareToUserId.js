import address0 from '$utils/address0'
import isValidUserId from './isValidUserId'

export default function canShareToUserId(value) {
    return isValidUserId(value) && value !== address0
}
