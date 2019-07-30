/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './AddToList-548.mdx'

export default {
  "id": 548,
  "name": "AddToList",
  "path": "List",
  "help": {
    "params": {
      "index": "index to add to, from 0 to length of list"
    },
    "paramNames": [
      "index"
    ],
    "inputs": {
      "item": "item to add to list",
      "list": "the list to add to"
    },
    "inputNames": [
      "item",
      "list"
    ],
    "outputs": {
      "error": "error string if given invalid index",
      "list": "the result if operation successful"
    },
    "outputNames": [
      "error",
      "list"
    ],
    "helpText": moduleDescription
  }
}
