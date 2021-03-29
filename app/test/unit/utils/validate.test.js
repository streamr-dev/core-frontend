import * as all from '$mp/utils/validate'
import * as constants from '$mp/utils/constants'

describe('validate utils', () => {
    describe('isValidSearchQuery', () => {
        it(`must limit the search character throughput to ${constants.searchCharMax} characters long`, () => {
            const goodSearch = 'Lorem ipsum dolor sit amet'
            const tooLongSearch =
                `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Est placerat in egestas erat imperdiet sed euismod. Vitae proin sagittis nisl 
                rhoncus mattis. Ullamcorper morbi tincidunt ornare massa eget. Urna nec tincidunt praesent semper 
                feugiat nibh sed pulvinar. Quis varius quam quisque id diam vel quam elementum pulvinar. Praesent 
                tristique magna sit amet purus gravida. Condimentum mattis pellentesque id nibh tortor. Lectus urna 
                duis convallis convallis tellus id interdum velit. Ac ut consequat semper viverra. AdipiscingLorem 
                ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Est placerat in egestas erat imperdiet sed euismod. Vitae proin sagittis nisl 
                rhoncus mattis. Ullamcorper morbi tincidunt ornare massa eget. Urna nec tincidunt praesent semper 
                feugiat nibh sed pulvinar. Quis varius quam quisque id diam vel quam elementum pulvinar. Praesent 
                tristique magna sit amet purus gravida. Condimentum mattis pellentesque id nibh tortor. Lectus urna 
                duis convallis convallis tellus id interdum velit. Ac ut consequat semper viverra. Adipiscing
                rhoncus mattis. Ullamcorper morbi tincidunt ornare massa eget. Urna nec tincidunt praesent semper`
            expect(all.isValidSearchQuery(tooLongSearch)).toBe(false)
            expect(all.isValidSearchQuery(goodSearch)).toBe(true)
        })
    })
})
