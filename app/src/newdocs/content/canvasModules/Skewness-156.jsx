/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Skewness-156.mdx'

export default {
  "id": 156,
  "name": "Skewness",
  "path": "Time Series: Statistics",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Input random variable"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "minSamples": "Number of samples required to produce output",
      "windowLength": "Length of the sliding window of values"
    },
    "outputs": {
      "out": "Skewness"
    },
    "paramNames": [
      "windowLength",
      "minSamples"
    ]
  }
}
