/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './StandardDeviation-138.mdx'

export default {
  "id": 138,
  "name": "StandardDeviation",
  "path": "Time Series: Statistics",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Input time series"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "minSamples": "Minimum number of observations for producing output",
      "windowLength": "Length of the sliding window (number of observations)"
    },
    "outputs": {
      "out": "Standard deviation"
    },
    "paramNames": [
      "windowLength",
      "minSamples"
    ]
  }
}
