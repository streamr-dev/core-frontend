// @flow

// TODO: These are fake interactions, should come from Metamask/smart contract
export const setAllowance: () => Promise<any> = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (confirm('Set allowance?')) {
                resolve()
            } else {
                reject()
            }
        }, 100)
    })
}

export const approvePayment: () => Promise<any> = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (confirm('Approve transaction?')) {
                resolve()
            } else {
                reject()
            }
        }, 100)
    })
}

export const startTransaction: () => Promise<any> = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 1500)
    })
}
