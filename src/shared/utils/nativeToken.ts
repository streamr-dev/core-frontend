const mapping = {
    137: 'MATIC',
    8997: 'MATIC',
    100: 'xDai',
}

const getNativeTokenName = (chainId: string | number) => {
    return mapping[chainId] || 'Ether'
}

export default getNativeTokenName
