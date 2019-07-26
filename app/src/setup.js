// @flow

import BN from 'bignumber.js'
import loginInterceptor from '$auth/utils/loginInterceptor'

loginInterceptor()

BN.config({
    DECIMAL_PLACES: 18,
})
