/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './NewMap-232.mdx'

export default {
  "id": 232,
  "name": "NewMap",
  "path": "Map",
  "help": {
    "params": {
      "alwaysNew": "When false (defult), same map is sent every time. When true, a new map is sent on each activation."
    },
    "paramNames": [
      "alwaysNew"
    ],
    "inputs": {
      "trigger": "used to activate module"
    },
    "inputNames": [
      "trigger"
    ],
    "outputs": {
      "out": "a map"
    },
    "outputNames": [
      "out"
    ],
    "helpText": moduleDescription
  }
}
