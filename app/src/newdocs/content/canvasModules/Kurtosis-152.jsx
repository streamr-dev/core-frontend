/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Kurtosis-152.mdx'

export default {
  "id": 152,
  "name": "Kurtosis",
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
      "minSamples": "Number of samples required to produce output. At least 4 samples are required to calculate kurtosis",
      "windowLength": "Length of the sliding window of values"
    },
    "outputs": {
      "out": "Kurtosis"
    },
    "paramNames": [
      "windowLength",
      "minSamples"
    ]
  }
}
