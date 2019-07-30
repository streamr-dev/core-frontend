/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './FlexBarify-158.mdx'

export default {
  "id": 158,
  "name": "FlexBarify",
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
      "value": "Value to be sampled into the bar",
      "valueLength": "Length of each event, contributes to <span class='highlight'>barLength</span>"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "valueLength",
      "value"
    ],
    "params": {
      "barLength": "Length of each bar (in <span class='highlight'>valueLength</span> units)"
    },
    "outputs": {
      "open": "Value at start of period",
      "high": "Maximum value during period",
      "avg": "Average of values received during the period, weighted by <span class='highlight'>valueLength</span>",
      "low": "Minimum value during period",
      "close": "Value at end of period (the most recent value)"
    },
    "paramNames": [
      "barLength"
    ]
  }
}
