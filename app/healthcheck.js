const axios = require('axios')

/* eslint-disable no-console */

const checkUrl = async (url) => {
    try {
        const response = await axios({
            method: 'get',
            url,
            timeout: 10000,
        })
        return response.status === 200
    } catch (err) {
        console.error('Error in checkUrl', err)
        return false
    }
}

const checkMarketplace = async () => {
    const result = await checkUrl('http://localhost:3333')
    if (result) {
        console.log('Marketplace is UP')
        return true
    }
    console.error('Marketplace is DOWN')
    return false
}

const checkLogin = async () => {
    const result = await checkUrl('http://localhost:3333/login')
    if (result) {
        console.log('Login is UP')
        return true
    }
    console.error('Login is DOWN')
    return false
}

const checkAll = async () => {
    const results = await Promise.all([
        checkMarketplace(),
        checkLogin(),
    ])

    // Return false even if a single check fails
    return !results.includes(false)
}

checkAll()
    .then((result) => {
        if (result) {
            console.log('Platform is UP')
            process.exit(0)
        } else {
            console.error('Platform is DOWN')
            process.exit(1)
        }
    })
    .catch((error) => {
        console.error('Could not run checks!')
        console.error(error)
        process.exit(1)
    })
