/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Delay-7.mdx'

export default {
  "id": 7,
  "name": "Delay",
  "path": "Time Series: Utils",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Incoming values to be delayed"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "delayEvents": "Number of events to delay the incoming values"
    },
    "outputs": {
      "out": "The delayed values"
    },
    "paramNames": [
      "delayEvents"
    ]
  }
}
