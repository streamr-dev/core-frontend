import { BN } from '~/utils/bn'

BN.config({
    DECIMAL_PLACES: 18,
    EXPONENTIAL_AT: BN.config().RANGE,
})
