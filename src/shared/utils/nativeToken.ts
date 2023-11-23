const mapping = {
    137: 'MATIC',
    100: 'xDai',
    8995: 'DEV',
    8997: 'DEV',
    31337: 'DEV',
    80001: 'MATIC',
}

const getNativeTokenName = (chainId: string | number) => {
    return mapping[chainId] || 'Ether'
}

export default getNativeTokenName
