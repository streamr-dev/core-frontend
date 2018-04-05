// @flow

/*
    These are all type
    {
        id: label
    }
 */

// The order of these must be the same than in the smart contract
export const currencies = {
    DATA: 'DATA',
    USD: 'USD',
}

// The order of these must be the same than in the smart contract
export const productStates = {
    NOT_DEPLOYED: 'NOT_DEPLOYED',
    DEPLOYED: 'DEPLOYED',
    DEPLOYING: 'DEPLOYING',
    UNDEPLOYING: 'UNDEPLOYING',
}

export const ethereumNetworks = {
    '1': 'Main',
    '3': 'Ropsten',
    '4': 'Rinkeby',
}

export const priceUnits = {
    second: 'Second',
    minute: 'Minute',
    hour: 'Hour',
    day: 'Day',
    week: 'Week',
}
