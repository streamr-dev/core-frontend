/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './CountByKey-221.mdx'

export default {
  "id": 221,
  "name": "CountByKey",
  "path": "Map",
  "help": {
    "params": {
      "sort": "Whether key-count pairs should be order by count",
      "maxKeyCount": "Maximum number of (sorted) key-count pairs to keep. Everything else will be dropped."
    },
    "paramNames": [
      "sort",
      "maxKeyCount"
    ],
    "inputs": {
      "key": "The (string) key"
    },
    "inputNames": [
      "key"
    ],
    "outputs": {
      "map": "Key-count pairs",
      "valueOfCurrentKey": "The occurrence count of the last key received. "
    },
    "outputNames": [
      "map",
      "valueOfCurrentKey"
    ],
    "helpText": moduleDescription
  }
}
