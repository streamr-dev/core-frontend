export default function getMainChainId() {
    return Number(process.env.MAIN_CHAIN_ID || 8995)
}
