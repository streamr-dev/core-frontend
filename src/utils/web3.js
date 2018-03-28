// @flow

import ee from 'event-emitter'

export const buy = (/* id: ProductId */) => {
    const emitter = ee()
    setTimeout(() => {
        emitter.emit('transactionHash', '0x37cd5542aa218fe021facc817b25f7f5de6398df6ce4e4fab5d59290a2a22cdz')
    }, 1000)
    setTimeout(() => {
        emitter.emit('receipt', {
            transactionHash: '0x37cd5542aa218fe021facc817b25f7f5de6398df6ce4e4fab5d59290a2a22cdz',
            // …
            gasUsed: 30234,
        })
    }, 3000)
    return emitter
}
