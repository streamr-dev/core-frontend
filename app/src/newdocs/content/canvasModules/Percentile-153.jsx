/* eslint-disable max-len */
import moduleDescription from './Percentile-153.md'

export default {
    id: 153,
    name: 'Percentile',
    path: 'Time Series: Statistics',
    help: {
        outputNames: [
            'out',
        ],
        inputs: {
            in: 'The input values',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            minSamples: 'Minimum number of observations for producing output',
            windowLength: 'Length of the sliding window',
            percentage: 'This percentage (0-100) of observations fall under the output of this module',
        },
        outputs: {
            out: "The value under which <span class='highlight'>percentage** % of input values fall",
        },
        paramNames: [
            'windowLength',
            'minSamples',
            'percentage',
        ],
    },
}
