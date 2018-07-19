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

const getConfig = () => {
    const env = process.env.NODE_ENV
    const config = {
        ...parseConfig(commonConfig, env),
        marketplace: parseConfig(marketplaceConfig, env),
        token: parseConfig(tokenConfig, env),
    }
    return config
}

export default getConfig
