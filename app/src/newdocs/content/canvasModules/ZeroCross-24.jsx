/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './ZeroCross-24.mdx'

export default {
  "id": 24,
  "name": "ZeroCross",
  "path": "Time Series: Triggers",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Input values"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "strictMode": "In strict mode, the incoming series actually needs to cross the trigger line before an output is produced. Otherwise a value is produced on the first event above or below the trigger line.",
      "threshold": "Zero or a positive value indicating the distance beyond zero that the incoming series must reach before a different output is triggered"
    },
    "outputs": {
      "out": "-1 or +1"
    },
    "paramNames": [
      "strictMode",
      "threshold"
    ]
  }
}
