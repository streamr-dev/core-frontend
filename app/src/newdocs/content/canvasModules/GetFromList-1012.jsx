/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './GetFromList-1012.mdx'

export default {
  "id": 1012,
  "name": "GetFromList",
  "path": "List",
  "help": {
    "params": {
      "index": "Index in the list for the item to be fetched. Negative index counts from end of list."
    },
    "paramNames": [
      "index"
    ],
    "inputs": {
      "in": "List to be indexed"
    },
    "inputNames": [
      "in"
    ],
    "outputs": {
      "out": "Item found at given index",
      "error": "Error message, e.g. <i>List is empty</i>"
    },
    "outputNames": [
      "out",
      "error"
    ],
    "helpText": moduleDescription
  }
}
