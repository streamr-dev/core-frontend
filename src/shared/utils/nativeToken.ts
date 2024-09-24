const mapping = {
    137: 'POL',
    100: 'xDai',
    8995: 'DEV',
    8997: 'DEV',
    31337: 'DEV',
    80002: 'POL',
}

const getNativeTokenName = (chainId: string | number) => {
    return mapping[chainId] || 'Ether'
}

export default getNativeTokenName
