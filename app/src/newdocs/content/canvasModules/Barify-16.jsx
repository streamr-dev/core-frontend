/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Barify-16.mdx'

export default {
  "id": 16,
  "name": "Barify",
  "path": "Time Series: Utils",
  "help": {
    "outputNames": [
      "open",
      "high",
      "low",
      "close",
      "avg"
    ],
    "inputs": {
      "in": "Input values"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "barLength": "Length of the bar (time interval) in seconds"
    },
    "outputs": {
      "open": "Value at start of period",
      "high": "Maximum value during period",
      "avg": "Simple average of values received during the period",
      "low": "Minimum value during period",
      "close": "Value at end of period (the most recent value)"
    },
    "paramNames": [
      "barLength"
    ]
  }
}
