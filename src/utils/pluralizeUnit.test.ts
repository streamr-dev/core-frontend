import { pluralizeUnit } from './pluralizeUnit'

describe('pluralizeUnit', () => {
    ;[
        {
            inputValue: 1,
            inputUnit: 'minute',
            expectedOutput: 'minute',
        },
        {
            inputValue: 5,
            inputUnit: 'minute',
            expectedOutput: 'minutes',
        },
        {
            inputValue: 3,
            inputUnit: 'hour',
            expectedOutput: 'hours',
        },
        {
            inputValue: 11,
            inputUnit: 'hour',
            expectedOutput: 'hours',
        },
        {
            inputValue: 1,
            inputUnit: 'hour',
            expectedOutput: 'hour',
        },
    ].forEach((testCase) => {
        it(`should translate ${testCase.inputValue} of "${testCase.inputUnit}" as "${testCase.expectedOutput}`, () => {
            expect(pluralizeUnit(testCase.inputValue, testCase.inputUnit)).toEqual(
                testCase.expectedOutput,
            )
        })
    })
})
