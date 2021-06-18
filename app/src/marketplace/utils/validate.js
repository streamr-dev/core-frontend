// @flow

import { isAddress } from 'web3-utils'

import { searchCharMax } from './constants'

export const isValidSearchQuery = (value: string) => value.length <= searchCharMax

export const isEthereumAddress = (value: string) => isAddress(value)

