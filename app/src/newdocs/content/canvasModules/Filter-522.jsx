/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Filter-522.mdx'

export default {
  "id": 522,
  "name": "Filter",
  "path": "Utils",
  "help": {
    "params": {},
    "paramNames": [],
    "inputs": {
      "pass": "The filter condition. 1 (true) for letting the event pass, 0 (false) to filter it out",
      "in": "The incoming event (any type)"
    },
    "inputNames": [
      "pass",
      "in"
    ],
    "outputs": {
      "out": "The event that came in, if passed. If filtered, nothing is sent"
    },
    "outputNames": [
      "out"
    ],
    "helpText": moduleDescription
  }
}
