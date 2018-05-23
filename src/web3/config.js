// @flow

import omit from 'lodash/omit'

import commonConfig from './common.config'
import tokenConfig from './token.config'
import marketplaceConfig from './marketplace.config'

const parseConfig = (config: {
    [string]: any,
    environments: {
        [string]: {
            [string]: any
        }
    }
}, env) => ({
    ...omit(config, ['environments']),
    ...(config.environments[env] || {}),
})

const env = process.env.NODE_ENV || 'default' // TODO: enforce the existence of NODE_ENV in webpack.config.js
const config = {
    ...parseConfig(commonConfig, env),
    marketplace: parseConfig(marketplaceConfig, env),
    token: parseConfig(tokenConfig, env),
}

export default () => config
